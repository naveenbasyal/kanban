const {
  RegisterUser,
  LoginUser,
  getAllUsers,
  getSingleUser,
  googleLogin,
  updateUserName,
  verifyEmail,
} = require("../controllers/user");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/health", (req, res) => {
  res.send("Route is working fine.");
});
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getSingleUser);
router.post("/google-login", googleLogin);
router.patch("/update-name", verifyToken, updateUserName);
router.patch("/verify-email/:id/:token", verifyEmail);

module.exports = router;
