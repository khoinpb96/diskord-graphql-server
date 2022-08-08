import jwt from "jsonwebtoken";
import { UserModel } from "../../models";

import register from "../../resolvers/register.resolver";

describe("register resolver", () => {
  const registerArg = { user: { username: "kilian", password: "123456" } };
  it("should return accessToken if query successfully", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(false);
    jest.spyOn(UserModel, "create").mockImplementation(() => "newUser");
    jest.spyOn(jwt, "sign").mockImplementation(() => "accessToken");

    const res = await register("", registerArg);
    expect(res).toEqual({ accessToken: "accessToken" });
  });
});
