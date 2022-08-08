import { UserModel } from "../../models";

import editUser from "../../resolvers/editUser.resolver";

describe("editUser resolver", () => {
  const editArgs = {
    user: { phoneNumber: "0312345678", email: "email@example.com" },
  };
  const context = { id: "user-id", message: "error message" };

  it("should return true if query successfully", async () => {
    jest.spyOn(UserModel, "findByIdAndUpdate").mockResolvedValue(true);

    const res = await editUser("", editArgs, context);

    expect(res).toBe(true);
  });
});
