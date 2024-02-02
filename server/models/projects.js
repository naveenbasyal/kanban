const mongoose = require("mongoose");
const Board = require("./board");
const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    lead: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    logo: {
      type: String,
      default: `https://picsum.photos/115/115?random=${new Date().getTime()}`,
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
