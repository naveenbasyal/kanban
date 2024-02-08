const { Board, Column, Task } = require("../models/board");
const Project = require("../models/projects");

const createBoard = async (req, res) => {
  const { title, description } = req.body;

  const createdBy = req.user?.id;

  try {
    const board = await new Board({
      createdBy,
      title,
      description,
      projectId: req.params?.projectId,
    });
    await board.save();

    // creating deafult columns

    const defaultColumns = ["Todo", "In Progress", "Done"];

    for (let i = 0; i < defaultColumns.length; i++) {
      const newColumn = new Column({
        createdBy,
        name: defaultColumns[i],
        boardId: board._id,
        order: i,
      });
      await newColumn.save();
      board.columns.push(newColumn._id);
    }

    await board.save();

    await Project.findByIdAndUpdate(
      req.params?.projectId,
      {
        $push: { boards: board._id },
      },
      { new: true }
    );
    const finalBoard = await board.populate("columns");
    return res.status(201).json({ finalBoard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const deleteBoard = async (req, res) => {
  const { id } = req.body;

  try {
    const board = await Board.findById(id);
    if (board) {
      await Board.findByIdAndDelete(id);

      //now we delete the board from project's board array
      await Project.findByIdAndUpdate(
        req.params?.projectId,
        {
          $pull: { boards: id },
        },
        { new: true }
      );
      //now we delte the columns linked to the board
      const columnIds = await Column.find({ boardId: id });

      for (let i = 0; i < columnIds.length; i++) {
        await Task.deleteMany({ columnId: columnIds[i]._id });
      }
      await Column.deleteMany({ boardId: id });
      //now we delte the tasks linked to the board

      return res
        .status(200)
        .json({ board, message: "Board deleted successfully" });
    } else {
      return res.status(404).json({ message: "Board not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const updateTaskOrder = async (req, res) => {
  const {
    destinationColumnId,
    sourceColumnId,
    sourceIndex,
    destinationIndex,
    taskId,
  } = req.body;

  try {
    if (sourceColumnId !== destinationColumnId) {
      const sourceColumn = await Column.findById(sourceColumnId);

      const destinationColumn = await Column.findById(destinationColumnId);

      if (destinationColumn) {
        // grabbing the task from source column
        const draggedTask = sourceColumn.tasks.find(
          (task) => task?._id.toString() === taskId
        );

        // removing the tasks from source column
        sourceColumn.tasks.splice(sourceIndex, 1);
        await sourceColumn.save();

        // adding the task to destination column
        destinationColumn.tasks.splice(destinationIndex, 0, draggedTask);
        await destinationColumn.save();

        // now we have to change the columnId of the task
        const task = await Task.findById(taskId);
        task.columnId = destinationColumnId;
        await task.save();

        return res
          .status(200)
          .json({ task, sourceColumn,destinationColumn, message: "Task reordered successfully" });
      }
    } else {
      const column = await Column.findById(sourceColumnId);
      const task = column.tasks.find((task) => task._id.toString() === taskId);
      column.tasks.splice(sourceIndex, 1);
      column.tasks.splice(destinationIndex, 0, task);
      await column.save();

      return res.status(200).json({
        task,
        column,
        message: " Task reordered successfully in the same column",
      });
    }

    return res.status(200).json({ message: "Board updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const editNameDescription = async (req, res) => {
  const { boardId, title, description, status } = req.body;
  try {
    if (!boardId)
      return res.status(400).json({ message: "Board id is required" });

    const board = await Board.findByIdAndUpdate(
      boardId,
      {
        title: title ? title : board?.title,
        description: description,
        status: status ? status : board?.status,
      },
      { new: true }
    );
    return res.status(200).json({ board });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

module.exports = {
  createBoard,
  deleteBoard,
  updateTaskOrder,
  editNameDescription,
};
