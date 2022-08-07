import bcrypt from "bcryptjs";
import { UserModel } from "../../models";

import deleteUser from "../../resolvers/deleteUser.resolver";

describe("deleteUser resolver", () => {
  const deleteUserArgs = { password: "123456" };
  const context = { id: "user-id", message: "error message" };

  it("should return true if query successfully", async () => {
    jest.spyOn(UserModel, "findById").mockResolvedValue({ remove: jest.fn() });
    jest.spyOn(bcrypt, "compare").mockImplementation(() => true);

    const res = await deleteUser("", deleteUserArgs, context);

    expect(res).toBe(true);
  });
});
