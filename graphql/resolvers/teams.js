const { AuthenticationError, UserInputError } = require('apollo-server');

const Team = require('../../db/models/Team');
const authenticate = require('../../util/authenticate');

module.exports = {
  Query: {
    async getTeamsByUser(_, { userID }) {
      try {
        const teams = Team.find(team => team.players?.includes(userID))
         .sort({ createdAt: -1 });
        return teams ?? [];
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTeam(_, { teamID }) {
      try {
        const team = Team.findById(teamID);
        if (team) {
          return team;
        } else {
          throw new Error('Team not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createTeam(_, { data }, context) {
      const user = authenticate(context);

      const newTeam = new Team({
        ...data,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        admins: [user.id]
      });

      const team = await newTeam.save();
      context.pubSub.publish('NEW_TEAM', {
        newTeam: team
      });
      return team;
    }
  },
  Subscription: {
    newTeam: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_TEAM')
    }
  }
}
