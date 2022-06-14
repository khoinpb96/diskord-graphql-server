import { UserModel } from "../models";
import { UserInputError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { RegisterMutationArgs, ResolverContext, UserQueryArgs } from "../types";

export const resolvers = {
  Query: {
    users: async () => {
      const users = await UserModel.find();
      return users;
    },
    user: async (
      _: any,
      { userId, token }: UserQueryArgs,
      context: ResolverContext
    ) => {
      if (
        !userId ||
        !token ||
        userId.trim().length === 0 ||
        token.trim().length === 0
      ) {
        throw new UserInputError("Invalid argument value");
      }

      const parsedToken = await jwt.verify(token, "Minerva");
      if (!parsedToken) {
        throw new UserInputError("Cannot verify token");
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`UserId: ${userId} not found`);
      }

      return user;
    },
    deleteAllUsers: async () => {
      await UserModel.deleteMany();
      return "Delete all users successfully";
    },
  },

  Mutation: {
    register: async (_: any, { user }: RegisterMutationArgs) => {
      const { email, password } = user;
      if (
        !email ||
        !password ||
        email.toLowerCase().trim().length < 6 ||
        password.trim().length < 6
      ) {
        throw new UserInputError("Invalid argument value");
      }

      const existedUser = await UserModel.findOne({ email });
      if (existedUser) {
        throw new UserInputError("User existed");
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        ...user,
        password: encryptedPassword,
      });

      if (!newUser) {
        throw new Error("Something went wrong, please try again");
      }

      const accessToken = jwt.sign({ id: newUser.id }, "Minerva");
      return { accessToken };
    },

    login: async (_: any, { user }: RegisterMutationArgs) => {
      const { email, password } = user;
      if (
        !email ||
        !password ||
        email.toLowerCase().trim().length < 6 ||
        password.trim().length < 6
      ) {
        throw new UserInputError("Invalid argument value");
      }

      const existedUser = await UserModel.findOne({ email });
      if (!existedUser) {
        throw new UserInputError("Wrong username");
      }

      const validedUser = await bcrypt.compare(password, existedUser.password);
      if (!validedUser) {
        throw new UserInputError("Wrong password");
      }

      const accessToken = jwt.sign({ id: existedUser.id }, "Minerva");
      return { accessToken };
    },
  },

  // editUser: async (_: any, __: any, context: ResolverContext) => {},
};
