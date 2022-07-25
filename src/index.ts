import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";

import express from "express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import context from "./context";
import { env } from "./utils";

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const startApolloServerAndMongoose = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app, path: env.SERVER_PATH });

    await mongoose.connect(env.MONGO_URI!);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${env.SERVER_PATH}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startApolloServerAndMongoose();
