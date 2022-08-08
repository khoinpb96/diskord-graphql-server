import { UserInputError } from "apollo-server-core";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel } from "../models";
import { AuthMutationArgs } from "../types";
import { env } from "../utils";

export default async (_: any, { user }: AuthMutationArgs) => {
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
    expiresIn: "4h",
  });

  return { accessToken };
};
