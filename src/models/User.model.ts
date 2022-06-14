import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  bio: String,
  phone: String,
  photoUrl: String,
});

const User = mongoose.model("User", UserSchema);

export default User;
