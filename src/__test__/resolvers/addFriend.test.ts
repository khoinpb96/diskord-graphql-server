import bcrypt from "bcryptjs";
import { UserModel } from "../../models";

import addFriend from "../../resolvers/addFriend.resolver";

describe("addFriend resolver", () => {
  const addFriendArgs = { username: "kilian" };
  const context = { id: "user-id", message: "error message" };

  it("should return true if query successfully", async () => {
    jest.spyOn(UserModel, "findById").mockResolvedValue({
      id: "user-1",
      friends: [],
      save: jest.fn(),
    });

    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      id: "user-2",
      friends: [],
      save: jest.fn(),
    });

    const res = await addFriend("", addFriendArgs, context);

    expect(res).toBe(true);
  });
});
