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

  const alreadyHasThisFriend = user.friends.some(
    (friend: string) => friendId === friend
  );
  if (!alreadyHasThisFriend) {
    throw new UserInputError("You don't have this friend");
  }

  user.friends = user.friends.filter((friend: string) => friendId !== friend);
  await user.save();

  return true;
};
