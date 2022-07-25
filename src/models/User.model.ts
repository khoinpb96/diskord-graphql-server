import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  phoneNumber: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

export default User;
