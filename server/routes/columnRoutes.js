const router = require("express").Router();
//  ----- column routes ------

const { createColumn, deleteColumn, updateColumnOrder } = require("../controllers/column");

router.post("/create", createColumn);
router.delete("/", deleteColumn);
router.patch("/updateOrder", updateColumnOrder);

module.exports = router;
