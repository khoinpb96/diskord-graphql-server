import bcrypt from "bcryptjs";
import { UserInputError } from "apollo-server-core";
import { UserModel } from "../models";
import { ResolverContext } from "../types";

export default async (
  _: any,
  { password }: { password: string },
  context: ResolverContext
) => {
  const { id, message } = context;
  if (!id) {
    throw new UserInputError(message);
  }

  const existedUser = await UserModel.findById(id);
  const validedUser = await bcrypt.compare(password, existedUser.password);
  if (!validedUser) {
    throw new UserInputError("Wrong password");
  }

  await existedUser.remove();

  return true;
};
