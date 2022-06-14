import { ApolloServer } from "apollo-server-express";
import express from "express";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { context } from "./context";
import mongoose from "mongoose";

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const startApolloServerAndMongoose = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });

    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.zswww.mongodb.net/kproject"
    );

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startApolloServerAndMongoose();
