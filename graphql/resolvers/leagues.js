const { AuthenticationError, UserInputError } = require('apollo-server');

const League = require('../../db/models/League');
const authenticate = require('../../util/authenticate');

module.exports = {
  Query: {
    async getLeaguesByUser(_, { userID }) {
      console.log('getLeaguesByUser. userID: ', userID);
      try {
        const leagues = await League.find({
            players: {$in: [userID]}
          })
          .sort({ createdAt: -1 })
          .populate('admins')
          .exec();
        console.log('returning leagues:  ', leagues);
        return leagues;
      } catch (err) {
        console.log('error in getLeaguesByUser. err: ', err);
        throw new Error(err);
      }
    },
    async getLeagueByID(_, { leagueID }) {
      console.log('getLeagueByID');
      try {
        console.log('top of query');
        const league =
          await League.findById(leagueID)
            .populate('admins')
            .populate('seasons')
            .populate('players')
            .exec();
        console.log('league in query: ', league);
        return league;
      } catch (err) {
        console.log('error queryin league! err: ', err);
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createLeague(_, { leagueInput }, context) {
      console.log('league input: ', leagueInput);
      const user = authenticate(context);

      const newLeague = new League({
        ...leagueInput,
        createdAt: new Date().toDateString(),
        admins: [user.id],
        players: [user.id],
        seasons: []
      });

      const league = await newLeague.save();
      
      return league;
    }
  },
  Subscription: {
    newLeague: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_LEAGUE')
    }
  }
}

