import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";

import express from "express";
import { typeDefs } from "./schema";
import resolvers from "./resolvers";
import { context } from "./context";
import { env } from "./utils";

const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({
  server: httpServer,
  path: env.SERVER_PATH,
});
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema,
  context,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const startApolloServerAndMongoose = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app, path: env.SERVER_PATH });

    await mongoose.connect(env.MONGO_URI!);

    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${env.SERVER_PATH}`
      );
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

startApolloServerAndMongoose();

export default startApolloServerAndMongoose;
