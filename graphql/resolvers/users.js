const User = require('../../db/models/User');
const League = require('../../db/models/League');
const Season = require('../../db/models/Season');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError} = require('apollo-server');
const { OAuth2Client } = require("google-auth-library");
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

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

const authenticateOrCreateUser = async (token, res, createUser = false) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audient: `${process.env.GOOGLE_CLIENT_ID}`,
  });

  const payload = ticket.getPayload();
  let user = await User.findOne({ email: payload?.email });
  if (!user && createUser) {
    user = await new User({
      email: payload?.email,
      profilePicture: payload?.picture,
      name: payload?.name,
      createdAt: new Date().toISOString()
    });

    await user.save();
  } else if (!user && !createUser) {
    return null;
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
      name: payload.name,
      profilePicture: payload.picture,
      id: user._id,
    },
    token: accessToken
  }
}

const requireAuth = (context) => {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in');
  }
}

module.exports = {
  Mutation: {
    async login (_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);

      if(!valid) {
        throw new UserInputError('Errors', { errors }); 
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async loginUserWithGoogle (_, { token }, { res }) {
      try {
        const response = await authenticateOrCreateUser(token, res, false);

        if (response == null) {
          throw new UserInputError('User does not exist.');
        }

        return response;
      } catch (err) {
        console.error('Error logging in with Google: ', err);
        throw err;
      }
    },
    async register(_parents, { registerInput: { username, email, password, confirmPassword }}) {
      // todo: validate user data
      let inputErrors = {};
      const { valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        inputErrors = {...inputErrors, ...errors};
      }
      // todo: make sure user doesn't already exist
      const user = await User.findOne({
        username
      });

      if (user) {
        inputErrors = {...inputErrors, username: 'This username is taken'};
      }

      if (user || !valid) {
        throw new UserInputError('Errors registering a new user!', {errors: inputErrors});
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      }
    },
    async registerUserWithGoogle(_, { token }, { res }) {
      try {
        return await authenticateOrCreateUser(token, res, true);
      } catch (err) {
        console.error('Error registering new user with Google');
        throw err;
      }
    },
    async refreshToken(_, __, { req, res }) {
      const token = req.cookies.refreshToken;
      if (!token) throw new Error('Missing refresh token');

      try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) throw new Error('User not found');

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
        throw new Error('Error refreshing access token: ', err.message ?? 'Missing or invalid refresh token');
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