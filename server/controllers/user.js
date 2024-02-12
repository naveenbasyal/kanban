const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const Project = require("../models/projects");
const { Column, Board } = require("../models/board");

const RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res
        .status(400)
        .json(
          "You already have an account, Please login or Continue with Google"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    const FirstProject = new Project({
      title: "My First Project",
      description:
        "This is your first project, you can create boards and tasks to manage your project",
      userId: user._id,
    });
    await FirstProject.save();

    // push project Id to the user's projects array
    user.projects.push(FirstProject._id);
    await user.save();

    // create a board for the First project
    const FirstBoard = new Board({
      title: "My First Board",
      description:
        "This is your first board, you can create tasks and add more columns to manage your project",
      projectId: FirstProject._id,
      createdBy: user?._id,
    });
    await FirstBoard.save();
    // push board Id to the project's boards array
    await FirstProject.boards.push(FirstBoard._id);
    await FirstProject.save();
    await user.save();

    // create a column for the First board
    const defaultColumns = ["Todo", "In Progress", "Done"];

    for (let i = 0; i < defaultColumns.length; i++) {
      const newColumn = new Column({
        name: defaultColumns[i],
        boardId: FirstBoard._id,
        createdBy: user?._id,
      });
      await newColumn.save();
      FirstBoard.columns.push(newColumn._id);
    }

    await FirstBoard.save();
    await user.save();

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

  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res.status(404).send({
        message:
          "You are not registered, Please register or Continue with Google ",
      });
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

const updateUserName = async (req, res) => {
  const { name } = req.body;

  const userId = req.user?.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: name },
      { new: true }
    );
    await user.save();

    res.status(200).json(user);
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
  const { id } = req.params;

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

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const googleLogin = async (req, res) => {
  const { username, email, profilePicture, clientId, email_verified } =
    req.body;

  try {
    if (email_verified) {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(200).json({
          message: "User logged in successfully",
          user: user,
          token: generateToken(user._id, user.email),
        });
      } else {
        const password = email + clientId;
        const user = new User({
          username,
          email,
          password,
          profilePicture,
        });

        await user.save();
        
        const FirstProject = new Project({
          title: "My First Project",
          description:
            "This is your first project, you can create boards and tasks to manage your project",
          userId: user._id,
        });
        await FirstProject.save();

        // push project Id to the user's projects array
        user.projects.push(FirstProject._id);
        await user.save();

        // create a board for the First project
        const FirstBoard = new Board({
          title: "My First Board",
          description:
            "This is your first board, you can create tasks and add more columns to manage your project",
          projectId: FirstProject._id,
          createdBy: user?._id,
        });
        await FirstBoard.save();
        // push board Id to the project's boards array
        await FirstProject.boards.push(FirstBoard._id);
        await FirstProject.save();
        await user.save();

        // create a column for the First board
        const defaultColumns = ["Todo", "In Progress", "Done"];

        for (let i = 0; i < defaultColumns.length; i++) {
          const newColumn = new Column({
            name: defaultColumns[i],
            boardId: FirstBoard._id,
            createdBy: user?._id,
          });
          await newColumn.save();
          FirstBoard.columns.push(newColumn._id);
        }

        await FirstBoard.save();
        await user.save();

        return res.status(200).json({
          message: "User logged in successfully",
          user: user,
          token: generateToken(user._id, user.email),
        });
      }
    } else {
      return res.status(400).json({ message: "Email not verified" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = {
  RegisterUser,
  LoginUser,
  getAllUsers,
  getSingleUser,
  googleLogin,
  updateUserName,
};
