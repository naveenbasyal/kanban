const router = require("express").Router();
const { createTask, deleteTask, addLabel, deleteLabel,  updateTask, assignedTask } = require("../controllers/task");
const verifyToken = require("../middlewares/verifyToken");

router.post("/create", createTask);
router.delete("/", deleteTask);
router.patch("/updateTask", updateTask);
router.post("/assignTask", assignedTask);


// ------ label ------
router.post("/label/create", addLabel);
router.delete("/label", deleteLabel);

module.exports = router;
