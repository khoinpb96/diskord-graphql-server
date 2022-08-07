import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    "For testing purposes only"
    users: [User]

    "For testing purposes only"
    deleteAllUsers: String

    "Get user information using accessToken attached in the headers"
    user: User
  }

  type Mutation {
    register(user: AuthInput): AuthResponse
    login(user: AuthInput): AuthResponse

    editUser(user: EditUserInput): Boolean
    deleteUser(password: String): Boolean

    addFriend(username: String): Boolean
    deleteFriend(username: String): Boolean

    createMessage(message: String): Boolean
  }

  type Subscription {
    messageCreated: String
  }

  type User {
    id: ID
    username: String
    phoneNumber: String
    email: String
    friends: [Friend]
  }

  type Friend {
    id: ID
    username: String
  }

  type AuthResponse {
    accessToken: String
  }

  input AuthInput {
    username: String
    password: String
  }

  input EditUserInput {
    phoneNumber: String
    email: String
  }
`;

export default typeDefs;
