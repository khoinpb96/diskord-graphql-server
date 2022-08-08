import { UserModel } from "../../models";

import user from "../../resolvers/user.resolver";

describe("user resolver", () => {
  it("should return accessToken if query successfully", async () => {
    const context = { id: "user-id", message: "error message" };
    jest.spyOn(UserModel, "findById").mockResolvedValue(true);

    const res = await user("", "", context);
    expect(res).toEqual(true);
  });

  it("should throw an error if id from context were not provided", async () => {
    const context = { id: "", message: "error message" };

    try {
      await user("", "", context);
    } catch (error: any) {
      expect(error.message).toEqual("error message");
    }
  });

  it("should throw an error if user were not found", async () => {
    const context = { id: "user-id", message: "error message" };
    jest.spyOn(UserModel, "findById").mockResolvedValue(false);

    try {
      await user("", "", context);
    } catch (error: any) {
      expect(error.message).toEqual(`UserId: ${context.id} not found`);
    }
  });
});
