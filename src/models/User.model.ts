import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  email: String,
  friends: [mongoose.Types.ObjectId],
});

const User = mongoose.model("User", UserSchema);

export default User;
