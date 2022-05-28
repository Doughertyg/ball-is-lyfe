const User = require('../../db/models/User');
const League = require('../../db/models/League');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError} = require('apollo-server');
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');

const {SECRET_KEY} = require('../../.env');

function generateToken(user) {
  return jwt.sign({
    id: user.id, 
    email: user.email,
    username: user.username
  }, SECRET_KEY, { expiresIn: '1h'});
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
    }
  },
  Query: {
    async getPlayersInLeague(_, {leagueID}) {
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
        return league.players || [];
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}