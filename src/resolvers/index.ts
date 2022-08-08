import { UserInputError } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";

import { UserModel } from "../models";
import { ResolverContext } from "../types";

import addFriend from "./addFriend.resolver";
import deleteFriend from "./deleteFriend.resolver";
import deleteUser from "./deleteUser.resolver";
import editUser from "./editUser.resolver";
import login from "./login.resolver";
import register from "./register.resolver";
import editUser from "./editUser.resolver";
import deleteUser from "./deleteUser.resolver";

const resolvers = {
  Query: {
    user: user,
    //FOR TESTING ONLY
    users: async () => await UserModel.find(),
    deleteAllUsers: async () => {
      await UserModel.deleteMany();
      return "Delete all users successfully";
    },
  },

  Mutation: {
    register: register,
    login: login,
    editUser: editUser,
    deleteUser: deleteUser,
    addFriend: addFriend,
    deleteFriend: deleteFriend,

    createMessage: (_: any, { message }: { message: any }) => {
      pubsub.publish("MESSAGE_CREATED", {
        messageCreated: message,
      });
      return true;
    },
  },

  User: {
    friends: async ({ friends }: any) => {
      return friends.map(async (friendId: string) => {
        const friend = await UserModel.findById(friendId);
        return { id: friend.id, username: friend.username };
      });
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(["MESSAGE_CREATED"]),
    },
  },
};

export default resolvers;

//#publishing-an-event
