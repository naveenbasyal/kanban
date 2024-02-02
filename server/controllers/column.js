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
        order: board.columns.length,
      });

      await column.save();
      // add this columnId to Board's collumn array
      board.columns.push(column._id);
      await board.save();
      return res.status(201).json({ column });
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
      return res.status(200).json({ message: "Column deleted successfully" });
    } else {
      return res.status(404).json({ message: "Column not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const updateColumnOrder = async (req, res) => {
  const { boardId, columnId, sourceIndex, destinationIndex } = req.body;

  try {
    const allColumns = await Column.find({ boardId: boardId }).sort({
      order: 1,
    });

    const draggedColumn = await Column.findById(columnId);

    allColumns.splice(sourceIndex, 1);

    allColumns.splice(destinationIndex, 0, draggedColumn);

    for (let i = 0; i < allColumns.length; i++) {
      allColumns[i].order = i;
      await allColumns[i].save();
    }

    return res.status(200).json({ message: "Column order updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

module.exports = { createColumn, deleteColumn, updateColumnOrder };
