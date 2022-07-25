import { UserMutationArgs } from "./../types/index";
import { UserInputError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { AuthMutationArgs, ResolverContext } from "../types";
import { UserModel } from "../models";
import env from "../utils/environments";

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
    register: async (_: any, { user }: AuthMutationArgs) => {
      const { username, password } = user;

      if (
        !username ||
        !password ||
        username.toLowerCase().trim().length < 6 ||
        password.trim().length < 6
      ) {
        throw new UserInputError("Invalid argument value");
      }

      const existedUser = await UserModel.findOne({ username });
      if (existedUser) {
        throw new UserInputError("User existed");
      }

      const newUser = await UserModel.create({
        ...user,
        password: await bcrypt.hash(password, 10),
      });
      if (!newUser) {
        throw new Error("Something went wrong, please try again");
      }

      const accessToken = jwt.sign({ id: newUser.id }, env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return { accessToken };
    },

    login: async (_: any, { user }: AuthMutationArgs) => {
      const { username, password } = user;
      if (
        !username ||
        !password ||
        username.toLowerCase().trim().length < 6 ||
        password.trim().length < 6
      ) {
        throw new UserInputError("Invalid argument value");
      }

      const existedUser = await UserModel.findOne({ username });
      if (!existedUser) {
        throw new UserInputError("Wrong username");
      }

      const validedUser = await bcrypt.compare(password, existedUser.password);
      if (!validedUser) {
        throw new UserInputError("Wrong password");
      }

      const accessToken = jwt.sign({ id: existedUser.id }, env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      return { accessToken };
    },

    editUser: async (
      _: any,
      { user }: UserMutationArgs,
      context: ResolverContext
    ) => {
      const { phoneNumber, email } = user;
      if (
        !phoneNumber ||
        !email ||
        phoneNumber.trim().length < 6 ||
        email.trim().length < 6
      ) {
        throw new UserInputError("Invalid argument value");
      }

      const { id, message } = context;
      if (!id) {
        throw new UserInputError(message);
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, { ...user });
      if (!updatedUser) {
        throw new UserInputError("User not found");
      }

      return true;
    },

    deleteUser: async (_: any, __: any, context: ResolverContext) => {
      const { id, message } = context;
      if (!id) {
        throw new UserInputError(message);
      }

      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new UserInputError("User not found");
      }

      return true;
    },
  },
};

export default resolvers;
