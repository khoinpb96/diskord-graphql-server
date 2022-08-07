import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models";

import login from "../../resolvers/login.resolver";

describe("login resolver", () => {
  const loginArgs = { user: { username: "kilian", password: "123456" } };
  it("should return accessToken if query successfully", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(true);
    jest.spyOn(bcrypt, "compare").mockImplementation(() => true);
    jest.spyOn(jwt, "sign").mockImplementation(() => "accessToken");

    const res = await login("", loginArgs);

    expect(res).toEqual({ accessToken: "accessToken" });
  });
});
