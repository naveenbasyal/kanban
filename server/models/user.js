const mongoose = require("mongoose");

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
      default: function () {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${
          this.username?.toLowerCase()?.split(" ")[0]
        }`;
      },
    },
    verified: {
      type: Boolean,
      default: false,
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
