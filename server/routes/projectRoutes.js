const {
  createProject,
  getAllUserProjects,
  getSingleProject,
  deleteProject,
  getAllProjects,
  updateProjectBasic,
  handleStarredProject,
} = require("../controllers/project");

const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

// ----- project routes ------
router.post("/create", verifyToken, createProject);
router.get("/", verifyToken, getAllUserProjects);
router.get("/all", getAllProjects);
router.get("/:id", verifyToken, getSingleProject);
router.delete("/", verifyToken, deleteProject);
router.patch("/updateBasic", verifyToken, updateProjectBasic);
router.patch("/starred-project", verifyToken, handleStarredProject);

module.exports = router;
