const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username);
  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    console.log("new user", user);
    res.status(201).json({
      user,
      token: generateToken(user._id, user.email),
    });
  } catch (error) {
    throw new Error(error);
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User doesn't exist");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }
    return res.status(200).json({
      user,
      token: generateToken(user._id, user.email),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params || req.body;

  try {
    const user = await User.findById(id).populate({
      path: "projects",
      populate: {
        path: "boards",
        populate: {
          path: "columns",
          populate: {
            path: "tasks",
            populate: {
              path: "assignedTo",
            },
          },
        },
      },
    });
    console.log("user-server", user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = { RegisterUser, LoginUser, getAllUsers, getSingleUser };
