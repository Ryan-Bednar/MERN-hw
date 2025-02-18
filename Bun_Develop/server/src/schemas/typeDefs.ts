const typeDefs = `#graphql
    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth

        saveBook(book:BookInput!):User
        removeBook(bookId: String!):User
    }

    type User {
        _id: String,
        username: String,
        email: String,
        bookCount: int,
        savedBooks: [Book]
    }    

    input BookInput{
        author: [String],
        description: String,
        title: String,
        bookId: String,
        image: String,
        link: String
    }

    type Book{
        bookId: String,
        authors: [String],
        description: String,
        title: String,
        image: String,
        link: String
    } 

    type Auth{
        token: ID!,
        user: User
    }
`;

export default typeDefs;