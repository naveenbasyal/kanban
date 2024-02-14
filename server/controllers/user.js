const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const Project = require("../models/projects");
const { Column, Board } = require("../models/board");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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

    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const verificationLink = `https://kanbuddy.vercel.app/verify-email/${user._id}/${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "KanBuddy - Verify your email",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #3498db;">Verify Your Email</h1>
          <p style="font-size: 16px;">Click the link below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
          <p style="font-size: 14px; color: #555; margin-top: 20px;">If you didn't sign up for an account, you can ignore this email.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Something went wrong" });
      } else {
        console.log("Email sent: " + info.response);

        return res.status(201).json({
          message:
            "User registered successfully, Please verify your email, if you didn't receive the email, Please check your spam folder",
        });
      }
    });

    await user.save();
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
    if (!user.verified) {
      console.log("not verified");
      const verificationToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const verificationLink = `https://kanbuddy.vercel.app/verify-email/${user._id}/${verificationToken}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "KanBuddy - Verify your email",
        html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #3498db;">Kanbuddy - Verify Your Email</h1>
          <p style="font-size: 16px;">Click the link below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
          <p style="font-size: 14px; color: #555; margin-top: 20px;">If you didn't sign up for an account, you can ignore this email.</p>
        </div>
      `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: "Something went wrong" });
        } else {
          console.log("Email sent: " + info.response);

          return res.status(201).json({
            message:
              "Please verify your email, if you didn't receive the email, Please check your spam folder",
          });
        }
      });
    } else {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Invalid credentials" });
      }
      return res.status(200).json({
        user,
        token: generateToken(user._id, user.email),
      });
    }
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
        if (!user.verified) user.verified = true;
        await user.save();
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

const verifyEmail = async (req, res) => {
  const { id, token } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (user.verified) {
      return res.status(400).json({ error: "Email already verified" });
    }
    if (decoded.id === user._id.toString()) {
      console.log("match");
      user.verified = true;
      await user.save();
      console.log(user);
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
        message: "Email verified successfully",
        user,
        token: generateToken(user._id, user.email),
      });
    } else {
      return res.status(400).json({ error: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `https://kanbuddy.vercel.app/reset-password/${user._id}/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "KanBuddy - Reset your password",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #3498db;">KanBuddy - Reset Your Password</h1>
          <p style="font-size: 16px;">Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
          <p style="font-size: 14px; color: #555; margin-top: 20px;">If you didn't request to reset your password, you can ignore this email.</p>
        </div>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Something went wrong" });
      } else {
        console.log("Email sent: " + info.response);

        return res.status(201).json({
          message: "Please check your email to reset your password",
        });
      }
    });
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
  verifyEmail,
  updateUserName,
};
