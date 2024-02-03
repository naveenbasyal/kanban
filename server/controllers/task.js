const { Column, Task } = require("../models/board");

const createTask = async (req, res) => {
  const { text, columnId } = req.body;
  const createdBy = req.user?.id;
  try {
    const column = await Column.findById(columnId);
    if (column) {
      const task = await Task({
        text,
        columnId,
        createdBy,
        order: column.tasks.length,
      });
      await task.save();

      column.tasks.push(task._id);
      await column.save();
      return res.status(201).json({ task });
    } else {
      return res.status(404).json({ message: "Column not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", err });
  }
};

const deleteTask = async (req, res) => {
  const { id, columnId } = req.body;

  try {
    const task = Task.findById(id);
    if (task) {
      await Task.findByIdAndDelete(id);

      await Column.findByIdAndUpdate(
        columnId,
        { $pull: { tasks: id } },
        { new: true }
      );
      return res.status(200).json({ message: "Task deleted successfully" });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const updateTask = async (req, res) => {
  const { taskId, text, labels, flagged } = req.body;

  console.log(text, labels, flagged, taskId);
  try {
    const task = await Task.findById(taskId);
    const taskUpdated = await Task.findByIdAndUpdate(
      taskId,
      {
        text: text ? text : task.text,
        labels: labels ? labels : task.labels,
        flagged: flagged,
      },
      { new: true }
    );
    await taskUpdated.save();
    if (task) {
      return res.status(200).json({ updatedTask: taskUpdated });
    } else {
      return res.status(200).json({ message: "Task not updated" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const addLabel = async (req, res) => {
  const { taskId, labels } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (task) {
      const labelExists = await task.labels.find((label) =>
        labels.find((l) => l.toLowerCase() === label.toLowerCase())
      );

      if (labelExists) {
        return res
          .status(400)
          .json({ message: `${labelExists} already exists` });
      }
      labels.map((label) => task.labels.push(label));
      await task.save();
      return res.status(200).json({ task });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const deleteLabel = async (req, res) => {
  const { taskId, label } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (task) {
      const labelExists = task.labels.find(
        (l) => l.toLowerCase() === label.toLowerCase()
      );

      if (!labelExists) {
        return res.status(400).json({ message: `${label} does not exist` });
      }
      task.labels = task.labels.filter(
        (l) => l.toLowerCase() !== label.toLocaleLowerCase()
      );

      await task.save();
      console.log(task.labels);
      return res.status(200).json({ task });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const assignedTask = async (req, res) => {
  const { id, userIds } = req.body;
  // userIds is an aray of ids
  try {
    const task = await Task.findById(id).populate({
      path: "assignedTo",
      select: "picture",
    });
    if (task) {
      // check if the user is already assigned to the task
      const userExists = userIds.some((userId) => {
        return task.assignedTo.some((user) => {
          return user._id.toString() === userId.toString();
        });
      });

      if (userExists) {
        return res
          .status(400)
          .json({ message: `User already assigned to the task` });
      }
      userIds.map((userId) => task.assignedTo.push(userId));
      await task.save();
      return res.status(200).json({ task });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};
module.exports = {
  createTask,
  deleteTask,
  addLabel,
  deleteLabel,
  updateTask,
  assignedTask,
};
