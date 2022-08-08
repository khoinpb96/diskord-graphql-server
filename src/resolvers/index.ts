import { UserInputError } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";

import { ChannelModel, UserModel } from "../models";
import { ResolverContext } from "../types";

import addFriend from "./addFriend.resolver";
import deleteFriend from "./deleteFriend.resolver";
import deleteUser from "./deleteUser.resolver";
import editUser from "./editUser.resolver";

import login from "./login.resolver";
import register from "./register.resolver";
import user from "./user.resolver";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    user: user,
    channel: async (
      _: any,
      { channelId }: { channelId: string },
      context: ResolverContext
    ) => {
      if (!context.id) {
        throw new UserInputError(context.message);
      }

      const channel = await ChannelModel.findById(channelId);
      return {
        id: channel.id,
        messages: channel.messages,
        participants: channel.participants.filter(
          (p: { id: string }) => p.id !== context.id
        ),
      };
    },

    //FOR TESTING ONLY
    users: async () => await UserModel.find(),
    deleteAllUsers: async () => {
      await UserModel.deleteMany();
      return true;
    },
    channels: async () => await ChannelModel.find(),
  },

  Mutation: {
    register: register,
    login: login,
    editUser: editUser,
    deleteUser: deleteUser,
    addFriend: addFriend,
    deleteFriend: deleteFriend,

    createMessage: async (
      _: any,
      { message, channelId }: { message: string; channelId: string },
      context: ResolverContext
    ) => {
      const { id } = context;
      if (!id) {
        throw new UserInputError(context.message);
      }

      const user = await UserModel.findById(id);
      if (!user) {
        throw new UserInputError("User not found");
      }

      const channel = await ChannelModel.findById(channelId);
      if (!channel) {
        throw new UserInputError("Channel not found");
      }

      const sameUser = channel.messages[0]?.username === user.username;
      const textIsRecentlySent =
        Math.floor(Date.now() / 1000) - channel.messages[0]?.createAt < 60;

      if (sameUser && textIsRecentlySent) {
        channel.messages[0].text.push(message);
        await channel.save();

        pubsub.publish("MESSAGE_CREATED", {
          messageCreated: channel.messages[0],
        });

        return true;
      }

      const creatingMessage = {
        text: [message],
        username: user.username,
        createAt: Math.floor(Date.now() / 1000),
      };

      channel.messages.unshift(creatingMessage);
      await channel.save();

      pubsub.publish("MESSAGE_CREATED", {
        messageCreated: creatingMessage,
      });

      return true;
    },

    createChannel: async (
      _: any,
      { friendId }: { friendId: string },
      context: ResolverContext
    ) => {
      const { id, message } = context;
      if (!id) {
        throw new UserInputError(message);
      }

      const user = await UserModel.findById(id);
      const friend = await UserModel.findById(friendId);

      const currentChannels: any = await Promise.all(
        user.channels.map(
          async (channelId: string) => await ChannelModel.findById(channelId)
        )
      );

      currentChannels.forEach((channel: any) => {
        if (channel.participants.some((p: any) => p.id === friend.id)) {
          throw new UserInputError(
            `Already created channel with ${friend.username}`
          );
        }
      });

      const channel = await ChannelModel.create({
        participants: [
          { id: user.id, username: user.username },
          { id: friend.id, username: friend.username },
        ],
      });

      user.channels.push(channel.id);
      friend.channels.push(channel.id);
      await user.save();
      await friend.save();

      return true;
    },
  },

  User: {
    friends: async ({ friends }: any) => {
      return friends.map(async (friendId: string) => {
        const friend = await UserModel.findById(friendId);
        return { id: friend.id, username: friend.username };
      });
    },

    channels: async ({ id, channels }: any) => {
      return channels.map(async (channelId: string) => {
        const channels = await ChannelModel.findById(channelId);
        return {
          id: channels.id,
          participants: channels.participants.filter(
            (p: { id: string }) => p.id !== id
          ),
        };
      });
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(["MESSAGE_CREATED"]),
    },
  },
};

export default resolvers;
