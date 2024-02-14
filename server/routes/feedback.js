const router = require("express").Router();

const { postFeedback, getAllFeedbacks, postComment, getUserFeedback } = require("../controllers/feedback");

router.post("/", postFeedback);
router.get("/", getAllFeedbacks);
router.get("/user", getUserFeedback);
router.post("/comment", postComment);

module.exports = router;