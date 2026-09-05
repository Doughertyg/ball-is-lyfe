const User = require('../../db/models/User');
const League = require('../../db/models/League');
const Season = require('../../db/models/Season');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');
const config = require('../../config');
const { ValidationError, AuthError } = require('../errors/AppError');

const SECRET_KEY = config.secretKey;
const REFRESH_SECRET = config.refreshSecret;
const CLIENT_ID = config.googleClientId;

function generateToken(user) {
  return jwt.sign({
    id: user.id, 
    email: user.email,
    username: user.username
  }, SECRET_KEY, { expiresIn: '1h'});
}

const createAccessToken = (userId) => jwt.sign({ userId: userId }, SECRET_KEY, { expiresIn: "5m" });
const createRefreshToken = (userId) => jwt.sign({ userId: userId }, REFRESH_SECRET, { expiresIn: "30d" });

const googleClient = new OAuth2Client({
  clientId: `${CLIENT_ID}`,
});

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const hydrateGoogleProfile = async (user, payload) => {
  const googleProfilePicture = payload?.picture || user?.googleProfilePicture;

  if (!user || !googleProfilePicture) {
    return user;
  }

  const updates = {};

  if (!user.googleProfilePicture) {
    updates.googleProfilePicture = googleProfilePicture;
  }

  if (!user.profilePicture) {
    updates.profilePicture = googleProfilePicture;
  }

  if (user.name == null && payload?.name) {
    updates.name = payload.name;
  }

  if (Object.keys(updates).length > 0) {
    Object.assign(user, updates);
    await user.save();
  }

  return user;
};

const authenticateOrCreateUser = async (token, res, createUser = false) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const normalizedEmail = normalizeEmail(payload?.email);
  let user = await User.findOne({ email: normalizedEmail });

  if (!user && createUser) {
    user = new User({
      email: normalizedEmail,
      profilePicture: payload?.picture,
      googleProfilePicture: payload?.picture,
      name: payload?.name,
      authType: 'google',
      createdAt: new Date().toISOString()
    });

    await user.save();
  } else if (!user && !createUser) {
    return null;
  }

  const currentAuthType = user?.authType || (user?.password ? 'email_password' : 'google');

  if (user && currentAuthType !== 'google') {
    throw new ValidationError('This email is already linked to an email/password account. Please sign in with your email and password.');
  }

  if (user && !user.authType) {
    user.authType = currentAuthType;
  }

  if (user && currentAuthType === 'google') {
    await hydrateGoogleProfile(user, payload);
  }

  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return {
    user: {
      ...user,
      ...user._doc,
      name: user.name || payload.name,
      profilePicture: user.profilePicture || payload.picture,
      googleProfilePicture: user.googleProfilePicture || payload.picture,
      authType: user.authType || 'google',
      id: user._id,
    },
    token: accessToken
  }
}

const requireAuth = (context) => {
  if (!context.user) {
    throw new AuthError('You must be logged in');
  }
}

module.exports = {
  Mutation: {
    async login (_, { email, password }) {
      const normalizedEmail = normalizeEmail(email);
      const { valid, errors } = validateLoginInput(normalizedEmail, password);

      if(!valid) {
        throw new ValidationError('Errors', { errors });
      }

      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        errors.general = 'No account found for that email.';
        throw new ValidationError('No account found for that email.', { errors });
      }

      if (user.authType === 'google') {
        errors.general = 'This email is linked to Google Sign-In. Please use Google to continue.';
        throw new ValidationError('This email is linked to Google Sign-In. Please use Google to continue.', { errors });
      }

      if (!user.password) {
        errors.general = 'This account does not use email/password sign-in.';
        throw new ValidationError('This account does not use email/password sign-in.', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Incorrect email or password';
        throw new ValidationError('Incorrect email or password', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        authType: user.authType || 'email_password',
        token
      };
    },
    async loginUserWithGoogle (_, { token }, { res }) {
      try {
        const response = await authenticateOrCreateUser(token, res, false);

        if (response == null) {
          throw new ValidationError('No account found for this Google email. Please register first.');
        }

        return response;
      } catch (err) {
        console.error('Error logging in with Google: ', err);
        throw err;
      }
    },
    async register(_parents, { registerInput: { username, email, password, confirmPassword }}) {
      const normalizedEmail = normalizeEmail(email);
      const normalizedUsername = username.trim();
      let inputErrors = {};
      const { valid, errors} = validateRegisterInput(normalizedUsername, normalizedEmail, password, confirmPassword);
      if (!valid) {
        inputErrors = {...inputErrors, ...errors};
      }

      const emailTaken = await User.findOne({ email: normalizedEmail });
      if (emailTaken) {
        const existingAuthType = emailTaken.authType || (emailTaken.password ? 'email_password' : 'google');
        if (existingAuthType === 'google') {
          inputErrors = {...inputErrors, email: 'This email is already linked to a Google account. Please use Google Sign-In.'};
        } else {
          inputErrors = {...inputErrors, email: 'An account with this email already exists. Please sign in instead.'};
        }
      }

      const usernameTaken = await User.findOne({ username: normalizedUsername });
      if (usernameTaken) {
        inputErrors = {...inputErrors, username: 'This username is taken'};
      }

      if (!valid || Object.keys(inputErrors).length > 0) {
        throw new ValidationError('Errors registering a new user!', {errors: inputErrors});
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email: normalizedEmail,
        username: normalizedUsername,
        password,
        authType: 'email_password',
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        authType: res.authType,
        token
      }
    },
    async registerUserWithGoogle(_, { token }, { res }) {
      try {
        const response = await authenticateOrCreateUser(token, res, true);
        return response;
      } catch (err) {
        console.error('Error registering new user with Google');
        throw err;
      }
    },
    async refreshToken(_, __, { req, res }) {
      const token = req.cookies.refreshToken;
      if (!token) throw new AuthError('Missing refresh token');

      try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) throw new AuthError('User not found');

        const newAccessToken = createAccessToken(user._id);
        const newRefreshToken = createRefreshToken(user._id);

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        return {
          token: newAccessToken,
          user,
        };
      } catch (err) {
        console.log('Error refreshing access token: ', err);
        throw new AuthError('Missing or invalid refresh token');
      }
    },
    logout: async (_, __, { res }) => {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
      return true;
    }
  },
  Query: {
    async getAllPlayers() {
      return await User.find();
    },
    async getPlayersInLeague(_, {leagueID, seasonID}) {
      if (leagueID == null) {
        return [];
      }

      try {
        // querying all players
        if (leagueID == null) {
          return await User.find().exec();
        }
        // query players by league
        const league = await League.findById(leagueID)
          .populate('players').exec();

        if (league == null) {
          throw new Error('League unexpectedly null');
        }

        if (seasonID != null) {
          const season = await Season.findById(seasonID);
          return league.players.filter(player => !season.players.includes(player.id));
        }
        return league.players || [];
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlayersNotInLeague(_, {leagueID}) {
      if (leagueID == null) {
        return [];
      }

      try {
        const league = await League.findById(leagueID).exec();

        const players = await User.find().exec();
        if (league == null) {
          throw new Error('League unexpectedly null');
        }

        return players.filter(player => !league.players.includes(player.id));
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserContext(_, {token}) {
      try {
        return await authenticateOrCreateUser(token, false);
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  requireAuth
}