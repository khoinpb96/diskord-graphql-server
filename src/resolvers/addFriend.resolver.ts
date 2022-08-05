import { UserInputError } from "apollo-server-core";
import { UserModel } from "../models";
import { ResolverContext } from "../types";

export default async (
  _: any,
  { username }: { username: string },
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

  const friend = await UserModel.findOne({ username });
  if (!friend) {
    throw new UserInputError("Friend not found");
  }

  const alreadyHasThisFriend = user.friends.some(
    (friend: { username: string }) => username === friend.username
  );
  if (alreadyHasThisFriend) {
    throw new UserInputError("Already has this friend");
  }

  user.friends.push({ id: friend.id, username: friend.username });
  friend.friends.push({ id: user.id, username: user.username });
  await user.save();
  await friend.save();

  return true;
};
