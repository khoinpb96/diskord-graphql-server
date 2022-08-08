import { UserModel } from "../../models";

import deleteFriend from "../../resolvers/deleteFriend.resolver";

describe("deleteFriend resolver", () => {
  const deleteFriendArgs = { username: "minerva" };
  const context = { id: "user-id", message: "error message" };

  it("should return true if query successfully", async () => {
    jest.spyOn(UserModel, "findById").mockResolvedValue({
      id: "user-1",
      friends: ["user-2"],
      save: jest.fn(),
    });

    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      id: "user-2",
      friends: ["user-1"],
      save: jest.fn(),
    });

    const res = await deleteFriend("", deleteFriendArgs, context);

    expect(res).toBe(true);
  });
});
