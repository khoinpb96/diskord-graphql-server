import { UserInputError } from "apollo-server-core";
import { UserModel } from "../models";
import { ResolverContext, UserMutationArgs } from "../types";

export default async (
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
};
