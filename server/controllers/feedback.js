const Feedback = require("../models/feedback");
const User = require("../models/user");

const postFeedback = async (req, res) => {
  const { title, message } = req.body;

  const userId = req.user.id;
  if (!title || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const feedback = new Feedback({ userId, title, message });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllFeedbacks = async (req, res) => {
  const userEmail = req.user?.email;

  if (userEmail !== "naveenbasyal.001@gmail.com") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "username email profilePicture")
      .populate("comments.userId", "username email profilePicture")
      .sort("-createdAt");

    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserFeedback = async (req, res) => {
  const userId = req?.user?.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const feedbacks = await Feedback.find({ userId })
      .populate("userId")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username email profilePicture",
        },
      }).sort("-createdAt");

    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const postComment = async (req, res) => {
  const { feedbackId, message, userEmail } = req.body;

  const userId = req.user.id;
  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });
    feedback.comments.push({ userId, message });
    await feedback.save();
    return res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  postFeedback,
  getAllFeedbacks,
  postComment,
  getUserFeedback,
};
