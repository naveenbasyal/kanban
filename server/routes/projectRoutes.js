const { createBoard, deleteBoard } = require("../controllers/board");
const { createColumn,deleteColumn } = require("../controllers/column");
const {
  createProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
} = require("../controllers/project");

const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

// ----- project routes ------
router.post("/create", verifyToken, createProject);
router.get("/", verifyToken, getAllProjects);
router.get("/:id", verifyToken, getSingleProject);
router.delete("/", verifyToken, deleteProject);
// router.put("/:id", verifyToken, updateProject);





module.exports = router;
