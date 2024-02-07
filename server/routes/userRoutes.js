const {
  RegisterUser,
  LoginUser,
  getAllUsers,
  getSingleUser,
  googleLogin,
  updateUserName,
} = require("../controllers/user");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getSingleUser);
router.post("/google-login", googleLogin);
router.patch("/update-name",verifyToken, updateUserName);

module.exports = router;
