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

  type User {
    id: ID
    username: String
    phoneNumber: String
    email: String
    friends: [String]
  }

  type Mutation {
    register(user: AuthInput): AuthResponse
    login(user: AuthInput): AuthResponse

    editUser(user: EditUserInput): Boolean
    deleteUser(password: String): Boolean

    addFriend(friendId: String): Boolean
    deleteFriend(friendId: String): Boolean
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
