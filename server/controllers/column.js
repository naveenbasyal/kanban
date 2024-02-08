const { Board, Column, Task } = require("../models/board");

const createColumn = async (req, res) => {
  const { name, boardId } = req.body;
  console.log("name", name);
  const createdBy = req.user?.id;
  try {
    const board = await Board.findById(boardId);

    if (board) {
      const column = await Column({
        name,
        boardId,
        createdBy,
      });

      await column.save();
      // add this columnId to Board's collumn array
      board.columns.push(column._id);
      await board.save();
      return res.status(201).json(column);
    } else {
      return res.status(404).json({ message: "Board not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", err });
  }
};

const deleteColumn = async (req, res) => {
  const { columnId, boardId } = req.body;

  try {
    const column = await Column.findById(columnId);
    if (column) {
      await Column.findByIdAndDelete(columnId);
      //now we have to delete the column from board's column array
      await Board.findByIdAndUpdate(
        boardId,
        { $pull: { columns: columnId } },
        { new: true }
      );
      //now we have to delete the tasks linked to the column
      await Task.deleteMany({ columnId: columnId });
      return res
        .status(200)
        .json({ column, message: "Column deleted successfully" });
    } else {
      return res.status(404).json({ message: "Column not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// draggin and dropping columns
const updateColumnOrder = async (req, res) => {
  const { boardId, columnId, sourceIndex, destinationIndex } = req.body;

  try {
    const board = await Board.findById(boardId);

    const draggedColumn = await Column.findById(columnId);

    console.log("baord columns Before", board.columns);
    board.columns.splice(sourceIndex, 1);
    board.columns.splice(destinationIndex, 0, draggedColumn._id);

    await board.save();
    console.log("baord columns After", board.columns);

    return res
      .status(200)
      .json({ column: draggedColumn, message: "Column order updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const changeColumnName = async (req, res) => {
  const { columnId, newColumnName } = req.body;

  console.log("columnId", columnId, newColumnName);
  if (!columnId || !newColumnName)
    return res
      .status(400)
      .json({ message: "Please provide columnId and newColumnName" });
  try {
    const column = await Column.findByIdAndUpdate(
      columnId,
      { name: newColumnName },
      { new: true }
    );
    await column.save();
    return res.status(200).json({ column, message: "Column name updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

const UpdateColLimit = async (req, res) => {
  const { columnId, limit } = req.body;

  try {
    const column = await Column.findByIdAndUpdate(
      columnId,
      { limit: limit },
      { new: true }
    );
    await column.save();
    return res.status(200).json({ column, message: "Column limit updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

module.exports = {
  createColumn,
  deleteColumn,
  updateColumnOrder,
  changeColumnName,
  UpdateColLimit,
};
