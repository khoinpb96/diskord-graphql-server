import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  participants: [
    {
      id: { type: String, required: true },
      username: { type: String, required: true },
    },
  ],
  messages: [
    {
      text: [String],
      username: { type: String, required: true },
      createAt: { type: Number, required: true },
    },
  ],
});

const Channel = mongoose.model("Channel", ChannelSchema);

export default Channel;
