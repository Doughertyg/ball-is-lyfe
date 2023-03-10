const User = require('../../db/models/User');
const League = require('../../db/models/League');
const Season = require('../../db/models/Season');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError} = require('apollo-server');
const { OAuth2Client } = require("google-auth-library");
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');

const SECRET_KEY = process.env.SECRET_KEY;
function generateToken(user) {
  return jwt.sign({
    id: user.id, 
    email: user.email,
    username: user.username
  }, SECRET_KEY, { expiresIn: '1h'});
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client({
  clientId: `${CLIENT_ID}`,
});

const authenticateNewUser = async (token) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audient: `${process.env.GOOGLE_CLIENT_ID}`,
  });

  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload?.email });
  if (!user) {
    user = await new User({
      email: payload?.email,
      profilePicture: payload?.picture,
      name: payload?.name,
      createdAt: new Date().toISOString()
    });

    await user.save();
  }

  return {
    ...user._doc,
    ...user,
    id: user._id,
    token
  }
};

const authenticateExistingUser = async (token) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audient: `${process.env.GOOGLE_CLIENT_ID}`,
  });

  const payload = ticket.getPayload();
  let user = await User.findOne({ email: payload?.email });
  if (!user) {
    return null;
  }

  return {
    ...user._doc,
    ...user,
    name: payload.name,
    profilePicture: payload.picture,
    id: user._id,
    token
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
    async loginUser (_, { token }) {
      const user = await authenticateExistingUser(token);

      if (user == null) {
        throw new UserInputError('User not yet registered.');
      }

      return user;
    },
    async register(_āparents, { registerInput: { username, email, password, confirmPassword }}) {
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
    async registerUser(_, { token }) {
      return await authenticateNewUser(token);
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
        return await authenticateExistingUser(token);
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  authenticateExistingUser
}