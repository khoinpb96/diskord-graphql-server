import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    "For testing purposes only"
    users: [User]

    "For testing purposes only"
    deleteAllUsers: Boolean

    "For testing purposes only"
    channels: [Channel]

    "Get user information using accessToken attached in the headers"
    user: User

    "Get channel information that current user is participant"
    channel(channelId: String): Channel
  }

  type Mutation {
    register(user: AuthInput): AuthResponse
    login(user: AuthInput): AuthResponse

    editUser(user: EditUserInput): Boolean
    deleteUser(password: String): Boolean

    addFriend(username: String): Boolean
    deleteFriend(username: String): Boolean

    createChannel(friendId: String): Boolean
    createMessage(channelId: String, message: String): Boolean
  }

  type Subscription {
    messageCreated: Message
  }

  type User {
    id: ID
    username: String
    phoneNumber: String
    email: String
    friends: [Friend]
    channels: [ChannelGeneralInfo]
  }

  type Friend {
    id: ID
    username: String
  }

  type ChannelGeneralInfo {
    id: ID
    participants: [ChannelParticipant]
  }

  type Channel {
    id: ID
    participants: [ChannelParticipant]
    messages: [Message]
  }

  type Message {
    text: [String]
    username: String
    createAt: String
  }

  type ChannelParticipant {
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
