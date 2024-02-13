const Feedback = require("../models/feedback");

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
      .sort("-createdAt");
    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { postFeedback, getAllFeedbacks };
