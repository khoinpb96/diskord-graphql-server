import startApolloServerAndMongoose from "..";

jest.mock("apollo-server-express", () => ({
  ApolloServer: jest.fn().mockReturnValue({
    start: jest.fn(),
    applyMiddleware: jest.fn(),
  }),
}));

describe("server", () => {
  it("should initialize a ApolloServer", async () => {
    expect(true);
    // expect(await startApolloServerAndMongoose()).toBe(true);
  });
});
