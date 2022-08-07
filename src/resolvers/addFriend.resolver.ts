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

  if (user.id === friend.id) {
    throw new UserInputError("You cannot be friend with yourself");
  }

  const alreadyHasThisFriend = user.friends.some((friendId: string) => {
    return friendId.toString() === friend.id;
  });
  if (alreadyHasThisFriend) {
    throw new UserInputError("Already has this friend");
  }

  user.friends.push(friend.id);
  friend.friends.push(user.id);
  await user.save();
  await friend.save();

  return true;
};
