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
import user from "./user.resolver";

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
