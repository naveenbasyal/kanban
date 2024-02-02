const { Board, Column } = require("../models/board");
const Project = require("../models/projects");
const User = require("../models/user");

const createProject = async (req, res) => {
  const { title, description } = req.body;

  const userId = req.user?.id;
  try {
    const project = await new Project({
      userId,
      description,
      title,
    });

    await project.save();
    await User.findByIdAndUpdate(
      userId,
      { $push: { projects: project._id } },
      { new: true }
    );

    res.status(201).json(await project.populate("userId"));
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllProjects = async (req, res) => {
  const userId = req.user?.id;

  try {
    const projects = await Project.find({ userId })
      .populate({
        path: "userId",
      })
      .populate({
        path: "boards",
        populate: {
          path: "columns",
          options: { sort: { order: 1 } },
          populate: {
            path: "tasks",
            // options: { sort: { order: 1 } },

            populate: {
              path: "assignedTo",
              select: "email",
            },
          },
        },
      });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.body;

  const userId = req.user?.id;
  try {
    //find the project
    if (!id) return res.status(400).json({ message: "Project id is required" });
    const project = await Project.findById(id);

    if (project) {
      //now we have to check if any board is linked to this projectId
      if (project.userId.toString() !== userId.toString()) {
        return res
          .status(401)
          .json({ message: "You are not authorized to delete this project" });
      }
      const board = await Board.find({ projectId: id });
      if (board.length > 0) {
        await Promise.all(
          board.map(async (board) => {
            board.columns.map(async (column) => {
              await Column.findByIdAndDelete(column._id);
            });
            await Board.findByIdAndDelete(board._id);
          })
        );
      }
      await Project.findByIdAndDelete(id);
      //now we have to delete the project from user's project array
      if (userId) {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { projects: id } },
          { new: true }
        );
      }
      return res
        .status(200)
        .json({ message: "Project deleted successfully", project: project });
    } else {
      return res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getSingleProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id).populate({
      path: "boards",
      populate: {
        path: "columns",
        populate: {
          path: "tasks",
          populate: {
            path: "assignedTo",
            select: "email",
          },
        },
      },
    });

    return res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  deleteProject,
  updateProject,
  getSingleProject,
};
