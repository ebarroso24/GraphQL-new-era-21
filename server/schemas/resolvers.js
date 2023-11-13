// const { User } = require('../models');

// const resolvers = {
//   Query: {
//     me: async (parent, args, context) => {
//       if (context.user) {
//         const userData = await User.findOne({ _id: context.user._id });
//         return userData;
//       }
//       throw new Error('Not logged in');
//     },
//   },

//   Mutation: {
//     login: async (parent, { email, password }) => {
//       // Your existing login logic here
//     },
//     addUser: async (parent, { username, email, password }) => {
//       // Your existing user creation logic here
//     },
//     saveBook: async (parent, { bookData }, context) => {
//       // Your existing save book logic here
//     },
//     removeBook: async (parent, { bookId }, context) => {
//       // Your existing remove book logic here
//     },
//   },
// };

// module.exports = resolvers;

const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      try {
         
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError('Incorrect email or password');
        }

         
        const correctPassword = await user.isCorrectPassword(password);

        if (!correctPassword) {
          throw new AuthenticationError('Incorrect email or password');
        }

        
        const token = jwt.sign({ id: user._id }, 'your-secret-key', {
          expiresIn: '1d',  
        });

        return { token, user };
      } catch (error) {
        console.error(error);
        throw new AuthenticationError('Error during login');
      }
    },

    addUser: async (parent, { username, email, password }) => {
      try {
         
        const user = await User.create({ username, email, password });

         
        const token = jwt.sign({ id: user._id }, 'your-secret-key', {
          expiresIn: '1d', 
        });

        return { token, user };
      } catch (error) {
        console.error(error);
        throw new Error('Error creating user');
      }
    },

    saveBook: async (parent, { bookData }, context) => {
      try {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { savedBooks: bookData } },
            { new: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in to save a book.');
      } catch (error) {
        console.error(error);
        throw new Error('Error saving book');
      }
    },

    removeBook: async (parent, { bookId }, context) => {
      try {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in to remove a book.');
      } catch (error) {
        console.error(error);
        throw new Error('Error removing book');
      }
    },
  },
};

module.exports = resolvers;

