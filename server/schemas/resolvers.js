const { User } = require('../models');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new Error('Not logged in');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      // Your existing login logic here
    },
    addUser: async (parent, { username, email, password }) => {
      // Your existing user creation logic here
    },
    saveBook: async (parent, { bookData }, context) => {
      // Your existing save book logic here
    },
    removeBook: async (parent, { bookId }, context) => {
      // Your existing remove book logic here
    },
  },
};

module.exports = resolvers;
