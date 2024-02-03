const {
  createBoard,
  deleteBoard,
  updateTaskOrder,
  editNameDescription,
} = require("../controllers/board");

const router = require("express").Router();

// ----- boards routes ------
router.post("/:projectId/create", createBoard);
router.delete("/:projectId/", deleteBoard);
router.patch("/update", updateTaskOrder);
router.patch("/editNameDescription", editNameDescription);

module.exports = router;
