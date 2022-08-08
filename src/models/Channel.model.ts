import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  participants: [
    {
      id: String,
      username: String,
    },
  ],
  messages: [{ text: [String], username: String, createAt: Number }],
});

const Channel = mongoose.model("Channel", ChannelSchema);

export default Channel;
