const router = require("express").Router();
const { createTask, deleteTask, addLabel, deleteLabel,  updateTask, assignTask } = require("../controllers/task");
const verifyToken = require("../middlewares/verifyToken");

router.post("/create", createTask);
router.delete("/", deleteTask);
router.patch("/updateTask", updateTask);
router.patch("/assign-task", assignTask);


// ------ label ------
router.post("/label/create", addLabel);
router.delete("/label", deleteLabel);

module.exports = router;
