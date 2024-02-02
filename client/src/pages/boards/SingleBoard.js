import React, { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  DroppableId,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import {
  FaCheck,
  FaCross,
  FaPencilAlt,
  FaPlus,
  FaRegEdit,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { FaRegFlag } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { badgeColors } from "../../App";
import { AlignColumn, AlignRow, ThreeDots } from "../../components/svg";
import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { CreateNewTask, DeleteTaskById } from "../../store/slices/TaskSlice";
import { getAllProjects } from "../../store/slices/projectSlice";
import { UpdateBoardById } from "../../store/slices/boardSlice";
import { CiCirclePlus } from "react-icons/ci";
import CreateColumn from "./columns/CreateColumn.js";
import { ColumnEditorTool, TaskEditorTool } from "./helpers.js";
import {
  DeleteColumnById,
  UpdateColumnOrder,
} from "../../store/slices/columnSlice.js";
import EditTask from "./tasks/EditTask.js";

const SingleBoard = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const projectId = useParams()?.projectId;
  const boardId = useParams()?.boardId;
  // _______________ Get Projects ________________
  const { projects } = useSelector((state) => state?.projects);
  const { loading } = useSelector((state) => state?.task);

  // _______________ Board ________________
  const [board, setBoard] = useState();
  const [columns, setColumns] = useState([]);

  // ___________ Task Text Edit   ____________
  const [editTaskId, setEditTaskId] = useState(null);
  const [TaskToEdit, setTaskToEdit] = useState({});

  // ___________ Open and Close Editor Panel ____________
  const [isOpen, setIsOpen] = useState(false);
  const [openId, setOpenId] = useState(null);

  // _______________ Create Task Input Open ________________
  const [inputOpen, setInputOpen] = useState(false);
  const [inputOpenId, setInputOpenId] = useState(null);
  const [task, setTask] = useState("");

  // _______________ Create Column Overlay ________________
  const [toggleCreateColumn, setToggleCreateColumn] = useState(false);

  // _______________ Column Alignment ________________
  const [columnAlignment, setColumnAlignment] = useState(
    localStorage.getItem("columnAlignment") != null
      ? localStorage.getItem("columnAlignment")
      : "row"
  );

  // _______________ Get Single Board ________________
  useEffect(() => {
    const SingleBoard = projects
      ?.find((project) => project._id === projectId)
      ?.boards?.find((board) => board._id === boardId);
    setBoard(SingleBoard);
    setColumns(SingleBoard?.columns);
  }, [projects]);

  //  _____________ Toggle Create Task Input ________________
  const toggleCreateTask = (colId) => {
    task && setTask("");
    setInputOpen(!inputOpen);
    setInputOpenId(colId);
  };

  //  _______________ Focus on input ________________
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputOpen, inputOpenId]);

  //  _______________ Handle Create Task ________________
  const handleCreateTask = async (columnId) => {
    if (task.trim() === "") return toast.error("Task can't be empty");
    const data = await dispatch(CreateNewTask({ text: task, columnId }));
    if (data?.payload?.task) {
      setTask("");
      setInputOpenId(null);
      setInputOpen(false);
      dispatch(getAllProjects());
    }
  };

  //  _______________ Handle Delete Task ________________
  const handleDeleteTask = async (id, columnId) => {
    const data = await dispatch(DeleteTaskById({ id, columnId }));

    if (data?.payload?.message) {
      // toast.info(data.payload.message);
      dispatch(getAllProjects());
      setIsOpen(false);
      setOpenId(null);
    }
  };

  //  _______________ Handle Delete Column ________________
  const handleDeleteColumn = async (columnId) => {
    const data = await dispatch(
      DeleteColumnById({ columnId, boardId: board._id })
    );

    if (data.payload) {
      toast.info(data.payload.message);
      dispatch(getAllProjects());
      setIsOpen(false);
      setOpenId(null);
      const newColumns = board?.columns?.filter((col) => col._id !== columnId);

      const newBoard = {
        ...board,
        columns: newColumns,
      };
      setBoard(newBoard);
    }
  };

  // _______________ Handle Drag Task Logic ________________
  const handleDrag = async (result) => {
    const { destination, source, draggableId, type } = result;

    //  ____________ Base cases _____________
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // ______________ If column is dragged __________________
    if (type === "column") {
      const allColumns = [...board?.columns]; //shallow copy of columns
      const draggedColumn = allColumns.find(
        (column) => column._id === draggableId
      );
      allColumns.splice(source.index, 1);
      allColumns.splice(destination.index, 0, draggedColumn);
      setBoard({
        ...board,
        columns: allColumns,
      });
      if (board) {
        dispatch(
          UpdateColumnOrder({
            boardId: board._id,
            columnId: draggableId,
            sourceIndex: source.index,
            destinationIndex: destination.index,
          })
        );
        dispatch(getAllProjects());
        // toast.info(data.payload.message);
      }

      return;
    }
    // __________________ If task is dragged __________________
    else if (type == "task") {
      // Source Column
      const SourceColumn = board?.columns?.find(
        (column) => column.name === source.droppableId
      );

      // Destination Column
      const DestnationColumn = board?.columns?.find(
        (column) => column.name === destination.droppableId
      );

      // Dragged task
      const task = board?.columns
        ?.find((col) => col.name == source.droppableId)
        ?.tasks.find((task) => task._id == draggableId);

      //___________ If same Column ________________
      if (
        destination.droppableId === source.droppableId &&
        destination.index !== source.index
      ) {
        const newTaskIds = Array.from(SourceColumn?.tasks);
        newTaskIds.splice(source.index, 1);

        newTaskIds.splice(destination.index, 0, task);

        const newColumn = {
          ...SourceColumn,
          tasks: newTaskIds,
        };
        const newBoard = {
          ...board,
          columns: board?.columns?.map((column) =>
            column._id === newColumn._id ? newColumn : column
          ),
        };
        setBoard(newBoard);
        if (newBoard) {
          dispatch(
            UpdateBoardById({
              destinationColumnId: DestnationColumn._id,
              sourceColumnId: SourceColumn._id,
              sourceIndex: source.index,
              destinationIndex: destination.index,
              taskId: task._id,
            })
          );

          dispatch(getAllProjects());
        }
        return;
      } else {
        // _____________________ If the column is not same ________________________
        const SourceTasksArray = Array.from(SourceColumn?.tasks);

        SourceTasksArray.splice(source.index, 1);

        const newSourceColumn = {
          ...SourceColumn,
          tasks: SourceTasksArray,
        };

        const DestinationTasksArray = Array.from(DestnationColumn?.tasks);

        // adding the dragged task to the new column
        DestinationTasksArray.splice(destination.index, 0, task);

        const newDestinationColumn = {
          ...DestnationColumn,
          tasks: DestinationTasksArray,
        };

        const newBoard = {
          ...board,
          columns: board?.columns?.map((column) => {
            if (column._id === newSourceColumn._id) return newSourceColumn;
            if (column._id === newDestinationColumn._id)
              return newDestinationColumn;
            return column;
          }),
        };
        setBoard(newBoard);

        if (newBoard) {
          dispatch(
            UpdateBoardById({
              destinationColumnId: DestnationColumn._id,
              sourceColumnId: SourceColumn._id,
              sourceIndex: source.index,
              destinationIndex: destination.index,
              taskId: task._id,
            })
          );

          dispatch(getAllProjects());
        }
      }
    }
  };

  return (
    <div className="single-board m-10">
      <DragDropContext onDragEnd={handleDrag}>
        {/* ______ UPPER Board Info PART _______ */}
        <div className="flex flex-col gap-4 ">
          {/* -------- Name -------- */}
          <div className="flex items-center gap-5">
            <div
              title="Board name"
              className="board-name-edit text-heading lg:text-[2.5rem] font-bold"
            >
              {board?.title}
            </div>
            <span
              title="Board status"
              className={`inline-flex text-sm items-center rounded-md ${
                board?.status == "active"
                  ? badgeColors.blue.bg
                  : board?.status == "paused"
                  ? badgeColors.yellow.bg
                  : board?.status == "finished" && badgeColors.green.bg
              } px-2 py-1 text-lg capitalize font-medium ${
                board?.status == "active"
                  ? badgeColors.blue.text
                  : board?.status == "paused"
                  ? badgeColors.yellow.text
                  : board?.status == "finished" && badgeColors.green.text
              } ring-1 ring-inset ${
                board?.status == "active"
                  ? badgeColors.blue.ring
                  : board?.status == "paused"
                  ? badgeColors.yellow.ring
                  : board?.status == "finished" && badgeColors.green.ring
              }`}
            >
              {board?.status}
            </span>
            <div
              title="Edit board name"
              className="edit-title ml-5 transition-all duration-200 hover:shadow-lg active:translate-y-[1.4px] cursor-pointer hover:text-indigo-500 "
            >
              <FaRegEdit size={20} />
            </div>
          </div>
          {/* _______ Board Creation Date _____ */}
          <div className="board-creation-date text-xl text-purple">
            {new Date(board?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {"  -  Present"}
          </div>
          {/* -------  Description -------- */}
          <div className="board-description capitalize text-xl">
            {board?.description}
          </div>
          <div className="others flex justify-between items-center">
            <div className="team-members text-xl">
              <span className="font-semibold text-purple">Team:</span> 0 members
            </div>

            <div className="flex gap-32 items-center">
              <div className="grid-alignment cursor-pointer flex items-center gap-10">
                <div
                  title="Align columns in y axis"
                  onClick={() => {
                    setColumnAlignment("column");
                    localStorage.setItem("columnAlignment", "column");
                  }}
                  className="col mt-2"
                >
                  <AlignColumn columnAlignment={columnAlignment} />
                </div>
                <div
                  className="row"
                  title="Align columns in x axis"
                  onClick={() => {
                    setColumnAlignment("row");
                    localStorage.setItem("columnAlignment", "row");
                  }}
                >
                  <AlignRow columnAlignment={columnAlignment} />
                </div>
              </div>
              <button
                onClick={() => setToggleCreateColumn(true)}
                className="cursor-pointer gap-5 outline-none bg-[#16174b] hover:bg-[#1c3062] transition-all duration-200  active:translate-y-[1.3px] hover:shadow-gray-light create-board rounded-md p-5 flex  justify-center items-center "
              >
                <p className="text-white text-xl font-semibold">
                  Add more column
                </p>
                <CiCirclePlus
                  size={20}
                  color="white"
                  className="font-bold stroke-inherit"
                />
              </button>
            </div>
          </div>
        </div>
        {/* _________ Columns __________ */}
        <Droppable
          droppableId="columns-container"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`${
                columnAlignment == "row"
                  ? "flex overflow-x-auto w-[118rem]"
                  : "grid grid-cols-3 gap-10 w-fit"
              } gap-10 my-10  `}
            >
              {board?.columns?.map((col, index) => {
                return (
                  <Draggable
                    key={col._id.toString()}
                    draggableId={col._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`cursor-default ${
                          columnAlignment == "row"
                            ? "min-w-[30rem]"
                            : "w-[30rem]"
                        } rounded-md px-5 py-6 flex flex-col gap-2`}
                      >
                        {/* _____ Column Header Part ____ */}
                        <div
                          className={`border-b-4 my-2  ${
                            col?.limit && col?.tasks?.length <= col.limit
                              ? "bg-white"
                              : "bg-red"
                          } ${
                            col.name == "Todo"
                              ? "border-blue-100"
                              : col.name == "In Progress"
                              ? "border-indigo-100"
                              : col.name == "Done"
                              ? "border-green-100"
                              : "border-gray-100"
                          } p-2 flex items-center justify-between`}
                        >
                          {/* ___________ COL NAME ___________ */}
                          <div className="text-xl font-bold">{col.name} !</div>
                          <div className="limit">{col.limit}</div>
                          <span className="cursor-pointer ">
                            <ColumnEditorTool
                              handleDeleteColumn={handleDeleteColumn}
                              isOpen={isOpen}
                              setIsOpen={setIsOpen}
                              col={col}
                              openId={openId}
                              loading={loading}
                              setOpenId={setOpenId}
                            />
                          </span>
                          {/* ______ TASK LIST ______ */}
                        </div>
                        <div
                          className={`${
                            col.name == "Todo"
                              ? "bg-blue-50"
                              : col.name == "In Progress"
                              ? "bg-indigo-50"
                              : col.name == "Done"
                              ? "bg-green-50"
                              : "bg-gray-50"
                          } rounded-lg min-h-[50vh] py-2 px-3 `}
                        >
                          <Droppable
                            droppableId={col.name}
                            key={col._id}
                            type="task"
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="tasks-list my-5 flex flex-col gap-3 "
                              >
                                {col?.tasks?.map((task, index) => {
                                  return (
                                    // _________ TASK _____________
                                    <Draggable
                                      key={task._id}
                                      draggableId={task?._id?.toString()}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          key={task._id}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="task cursor-default border-2 rounded-lg border-indigo-100 p-5 flex flex-col gap-4 bg-white"
                                        >
                                          <div className="flex justify-between items-center">
                                            {/* _____ Labels ____ */}
                                            <div className="labels flex flex-wrap gap-2">
                                              <span
                                                className={`inline-flex text-sm items-center rounded-md ${
                                                  col.name == "Todo"
                                                    ? badgeColors.blue.bg
                                                    : col.name == "In Progress"
                                                    ? badgeColors.yellow.bg
                                                    : col.name == "Done" &&
                                                      badgeColors.green.bg
                                                } px-2 py-1 text-lg capitalize font-medium ${
                                                  col.name == "Todo"
                                                    ? badgeColors.blue.text
                                                    : col.name == "In Progress"
                                                    ? badgeColors.yellow.text
                                                    : col.name == "Done" &&
                                                      badgeColors.green.text
                                                } ring-1 ring-inset ${
                                                  col.name == "Todo"
                                                    ? badgeColors.blue.ring
                                                    : col.name == "In Progress"
                                                    ? badgeColors.yellow.ring
                                                    : col.name == "Done" &&
                                                      badgeColors.green.ring
                                                }`}
                                              >
                                                {col.name == "Todo"
                                                  ? "Todo"
                                                  : col.name == "In Progress"
                                                  ? "In Progress"
                                                  : col.name == "Done" &&
                                                    "Done"}
                                              </span>
                                              {task?.labels?.map(
                                                (label, index) => {
                                                  return (
                                                    <span
                                                      key={index}
                                                      className={`inline-flex items-center rounded-md  px-2 py-1 text-sm capitalize font-medium text-purple border-[.5px] border-gray-200`}
                                                    >
                                                      {label}
                                                    </span>
                                                  );
                                                }
                                              )}
                                            </div>
                                            {/* _______ ThreeDots ______ */}
                                            <span className="cursor-pointer ">
                                              <TaskEditorTool
                                                handleDeleteTask={
                                                  handleDeleteTask
                                                }
                                                setTaskToEdit={setTaskToEdit}
                                                isOpen={isOpen}
                                                setIsOpen={setIsOpen}
                                                editTaskId={editTaskId}
                                                setEditTaskId={setEditTaskId}
                                                task={task}
                                                col={col}
                                                openId={openId}
                                                loading={loading}
                                                setOpenId={setOpenId}
                                              />
                                            </span>
                                          </div>
                                          {/* _____ Text ____ */}
                                          <div className="task-name items-center text-xl my-1 rounded-lg flex gap-5 ">
                                            {task.text}
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          {/* _______ Input ______ */}
                          {inputOpen && inputOpenId == col._id && (
                            <div className="input-box p-3 rounded-lg bg-white ">
                              <textarea
                                ref={inputRef}
                                className="text-xl w-full min-h-36 border-2 border-gray-200 p-3 rounded-lg outline-none"
                                type="text"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                placeholder="What needs to be done?"
                              />
                            </div>
                          )}

                          {/* _______ Add Task Button ______ */}
                          <div className="flex  my-10 justify-between gap-10 items-center">
                            {inputOpen && inputOpenId == col._id && (
                              <button
                                onClick={() => handleCreateTask(col._id)}
                                className={`outline-none w-full ${
                                  col.name == "Todo"
                                    ? "bg-blue-100 text-blue-600 border-blue-200"
                                    : col.name == "In Progress"
                                    ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                                    : col.name == "Done"
                                    ? "bg-green-100 text-green-600 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                }border-2 h-fit shadow-sm hover:shadow-md p-3 text-xl rounded-lg flex justify-center`}
                              >
                                {loading ? (
                                  <AiOutlineLoading3Quarters
                                    className="animate-spin"
                                    size={16}
                                  />
                                ) : (
                                  "Add Task"
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => toggleCreateTask(col._id)}
                              className={`outline-none w-full ${
                                col.name == "Todo"
                                  ? ` ${
                                      inputOpen && inputOpenId == col._id
                                        ? "bg-gray-100 text-gray-600 border-gray-200"
                                        : "bg-blue-100 text-blue-600 border-blue-200"
                                    }`
                                  : col.name == "In Progress"
                                  ? ` ${
                                      inputOpen && inputOpenId == col._id
                                        ? "bg-gray-100 text-gray-600 border-gray-200"
                                        : "bg-indigo-100 text-indigo-600 border-indigo-200"
                                    }`
                                  : col.name == "Done"
                                  ? ` ${
                                      inputOpen && inputOpenId == col._id
                                        ? "bg-gray-100 text-gray-600 border-gray-200"
                                        : "bg-green-100 text-green-600 border-green-200"
                                    }`
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }
                       border-2 shadow-sm hover:shadow-md p-3 text-xl rounded-lg `}
                            >
                              {inputOpen && inputOpenId == col._id
                                ? "Cancel"
                                : "Add Task"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {/* _______ Add Column ______ */}
        {toggleCreateColumn && (
          <CreateColumn
            boardId={board?._id}
            toggleCreateColumn={toggleCreateColumn}
            setToggleCreateColumn={setToggleCreateColumn}
          />
        )}
        {/* _______ Edit Task Ovelay ______ */}
        {editTaskId && (
          <EditTask
            TaskToEdit={TaskToEdit}
            setTaskToEdit={setTaskToEdit}
            board={board}
            setBoard={setBoard}
          />
        )}
      </DragDropContext>
    </div>
  );
};

export default SingleBoard;
