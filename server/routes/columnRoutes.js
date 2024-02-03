const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
//  ----- column routes ------

const {
  createColumn,
  deleteColumn,
  updateColumnOrder,
  changeColumnName,
  UpdateColLimit,
} = require("../controllers/column");

router.post("/create", verifyToken, createColumn);
router.delete("/", verifyToken, deleteColumn);
router.patch("/updateOrder", verifyToken, updateColumnOrder);
router.patch("/updateName", verifyToken, changeColumnName);
router.patch("/updateLimit", verifyToken, UpdateColLimit);

module.exports = router;
