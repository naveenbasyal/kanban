const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
