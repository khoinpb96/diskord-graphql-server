import { typeDefs } from "../../schema";

jest.mock("apollo-server-core", () => ({
  gql: jest.fn().mockReturnValue("documentNode"),
}));

test("typeDefs should return documentNode", () => {
  expect(typeDefs).toBe("documentNode");
});
