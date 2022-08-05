import { UserInputError } from "apollo-server-core";
import { UserModel } from "../models";
import { ResolverContext } from "../types";

export default async (
  _: any,
  { friendId }: { friendId: string },
  context: ResolverContext
) => {
  const { id, message } = context;
  if (!id) {
    throw new UserInputError(message);
  }

  const user = await UserModel.findById(id);
  if (!user) {
    throw new UserInputError("User not found");
  }

  const friend = await UserModel.findById(friendId);
  if (!friend) {
    throw new UserInputError("Friend not found");
  }

  const alreadyHasThisFriend = user.friends.some(
    (friend: string) => friendId === friend
  );
  if (alreadyHasThisFriend) {
    throw new UserInputError("Already has this friend");
  }

  user.friends.push(friendId);
  await user.save();

  return true;
};
