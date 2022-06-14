import { gql } from "apollo-server-core";

export const typeDefs = gql`
  type Query {
    users: [User]
    user(userId: String, token: String): User
    deleteAllUsers: String
  }

  type User {
    email: String
    password: String
  }

  type Mutation {
    register(user: UserInput): UserMutationRespone
    login(user: UserInput): UserMutationRespone
  }

  type UserMutationRespone {
    accessToken: String
  }

  input UserInput {
    email: String
    password: String
  }
`;
