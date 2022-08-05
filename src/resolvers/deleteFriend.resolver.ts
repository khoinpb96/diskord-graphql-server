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
    (friend: { id: string }) => friendId === friend.id
  );

  if (!alreadyHasThisFriend) {
    throw new UserInputError("You don't have this friend");
  }

  user.friends = user.friends.filter(
    (friend: { id: string }) => friendId !== friend.id
  );
  friend.friends = friend.friends.filter(
    (friend: { id: string }) => user.id !== friend.id
  );

  await user.save();
  await friend.save();

  return true;
};
