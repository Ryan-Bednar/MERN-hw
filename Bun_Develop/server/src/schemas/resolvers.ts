import User, {UserDocument} from "../models/User";
import { authenticateError, signToken } from "../services/auth";

interface LoginUserArgs {
    email: string;
    password: string;
  }

const resolvers = {
    Query: {
        user: async (_parent: any, {_id}:{_id:string}): Promise<UserDocument[] | null> => {
            const params = _id;
            return User.find({params});
        } 
    },
    Mutation: {
        createUser: async (_parent:any, args: any): Promise<UserDocument | null> => {
            const user = await User.create(args);
            return user;
        },
        login:async (_parent: any, {email, password}:LoginUserArgs) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new authenticateError("Could not authenticate User!");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new authenticateError("Could not authenticate User!");
            }

            const token = signToken(user.username, user.email, user._id)

            return {token, user};
        },
        saveBook: async (_parent: any, {BookInput}: {BookInput: any}, context:any) => {
            if (!context.user) {
                throw new authenticateError('You need to be logged in!');
            }
            
            try{
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $addToSet: {savedBooks: BookInput} },
                    { new: true, runValidators:true}
                );
                return updatedUser;
            } catch (error) {
                console.log(error);
                throw new Error('Unable to save book');
            }
        },
        deleteBook: async (_parent: any, {BookInput}: {BookInput: any}, context: any) => {
            if (!context.user){
                throw new authenticateError('You need to be logged in!');
            }

            try{
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $pull: {books: BookInput}}
                );
                return updatedUser;
            } catch (error){
                throw new Error("Book unable to be deleted")
            }
        }
    }
}

export default resolvers;