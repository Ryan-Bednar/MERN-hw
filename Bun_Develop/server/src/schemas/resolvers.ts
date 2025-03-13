import User, { UserDocument } from "../models/User";
import { authenticateError, signToken } from "../services/auth";

interface LoginUserArgs {
  email: string;
  password: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _arg: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw authenticateError;
    },
  },
  Mutation: {
    addUser: async (_parent: any, args: any) => {
      try {
        const user = await User.create(args);
        const token = signToken(user.username, user.email, user._id);

        return { token, user };
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new authenticateError("Could not authenticate User!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new authenticateError("Could not authenticate User!");
      }

      const token = signToken(user.username, user.email, user._id);

      return { token, user };
    },
    saveBook: async (_parent: any, args: any, context: any) => {
      // console.log(context.user)
      if (!context.user) {
        throw new authenticateError("You need to be logged in!");
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.book } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (error) {
        console.log(error);
        throw new Error("Unable to save book");
      }
    },
    removeBook: async (_parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new authenticateError("You need to be logged in!");
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: {
                bookId: args.bookId
              },
            },
          },
          {
            new: true
          }
        );
        return updatedUser;
      } catch (error) {
        throw new Error("Book unable to be deleted");
      }
    },
  },
};

export default resolvers;
