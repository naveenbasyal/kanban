const router = require("express").Router();

const { postFeedback, getAllFeedbacks } = require("../controllers/feedback");

router.post("/", postFeedback);
router.get("/", getAllFeedbacks);

module.exports = router;