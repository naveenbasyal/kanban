const mongoose = require("mongoose");

const randomKey = new Date().getTime();

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    bio: {
      type: String,
      default: "I'm using Kanbuddy!",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: `https://joesch.moe/api/v1/male/random?key=${randomKey.toString()}`,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
