import { UserInputError } from "apollo-server-express";
import bcrypt from "bcryptjs";

import { UserMutationArgs } from "./../types/index";
import { UserModel } from "../models";
import { ResolverContext } from "../types";

import addFriend from "./addFriend.resolver";
import deleteFriend from "./deleteFriend.resolver";
import login from "./login.resolver";
import register from "./register.resolver";
import editUser from "./editUser.resolver";
import deleteUser from "./deleteUser.resolver";

const resolvers = {
  Query: {
    users: async () => await UserModel.find(),
    user: async (_: any, __: any, context: ResolverContext) => {
      const { id, message } = context;
      if (!id) {
        throw new UserInputError(message);
      }

      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error(`UserId: ${context.id} not found`);
      }

      return user;
    },

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
  },

  User: {
    friends: async ({ friends }: any) => {
      return friends.map(async (friendId: string) => {
        const friend = await UserModel.findById(friendId);
        return { id: friend.id, username: friend.username };
      });
    },
  },
};

export default resolvers;
