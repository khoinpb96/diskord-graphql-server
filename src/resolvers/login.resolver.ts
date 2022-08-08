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
  if (!existedUser || !existedUser.password) {
    throw new UserInputError("Wrong username");
  }

  const validedUser = await bcrypt.compare(password, existedUser.password);
  if (!validedUser) {
    throw new UserInputError("Wrong password");
  }

  const accessToken = jwt.sign({ id: existedUser.id }, env.JWT_SECRET!, {
    expiresIn: "4h",
  });
  return { accessToken };
};
