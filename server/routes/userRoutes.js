const {
  RegisterUser,
  LoginUser,
  getAllUsers,
  getSingleUser,
} = require("../controllers/user");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getSingleUser);

module.exports = router;
