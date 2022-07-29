import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    users: [User]
    user: User
    deleteAllUsers: String
  }

  type User {
    username: String
    phoneNumber: String
    email: String
  }

  type Mutation {
    register(user: AuthInput): AuthResponse
    login(user: AuthInput): AuthResponse

    editUser(user: EditUserInput): Boolean
    deleteUser(password: String): Boolean
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
