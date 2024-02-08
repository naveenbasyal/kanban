import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaInfo, FaInfoCircle, FaPencilAlt, FaRegEdit } from "react-icons/fa";
import { IoCheckmark, IoClose, IoFlag } from "react-icons/io5";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { badgeColors } from "../../App";
import { AlignColumn, AlignRow, ThreeDots } from "../../components/svg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  AssignTaskToMember,
  CreateNewTask,
  DeleteTaskById,
} from "../../store/slices/TaskSlice";
import { getAllProjects } from "../../store/slices/projectSlice";
import { UpdateTaskOrder } from "../../store/slices/boardSlice";
import { CiCirclePlus } from "react-icons/ci";
import CreateColumn from "./columns/CreateColumn.js";
import { ColumnEditorTool, TaskEditorTool } from "./helpers.js";
import {
  DeleteColumnById,
  UpdateColName,
  UpdateColumnOrder,
} from "../../store/slices/columnSlice.js";
import EditTask from "./tasks/EditTask.js";
import ColumnLimitOverlay from "./columns/ColumnLimitOverlay.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useUser } from "../../Context/userContext.js";
import EditBoardOverlay from "./EditBoardOverlay.js";
import { MdInfoOutline } from "react-icons/md";
// __________ Socket io ___________
import io from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

const SingleBoard = ({ allProjects, setAllProjects }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const projectId = useParams()?.projectId;
  const boardId = useParams()?.boardId;
  const { user: myprofile } = useUser();

  // _______________ Get Projects ________________
  const { allProjects: projects } = useSelector((state) => state?.projects);
  const { loading, assignLoading } = useSelector((state) => state?.task);
  const { loading: columnLoading } = useSelector((state) => state?.column);

  // _______________ Project Owner Id ________________
  const [projectOwnerId, setProjectOwnerId] = useState(null);
  // _______________ Board ________________
  const [board, setBoard] = useState();
  const [toggleEditBoard, setToggleEditBoard] = useState(null);

  //  ______________ Progres Bar ________________
  const [progress, setProgress] = useState(0);

  // _________ Members of all the tasks of this board ______
  const [allTasksMembers, setAllTasksMembers] = useState([]);

  // ___________ Task Text Edit   ____________
  const [editTaskId, setEditTaskId] = useState(null);
  const [TaskToEdit, setTaskToEdit] = useState({});

  // ________ Add Assignee to Task _______
  const [toggleAddAssignee, setToggleAddAssignee] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [assignee, setAssignee] = useState({});
  const [assigneeList, setAssigneeList] = useState([]);

  // ___________ Column Name Edit   ____________
  const [editColId, setEditColId] = useState(null);
  const [colInputOpen, setColInputOpen] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [colLimit, setColLimit] = useState(null);

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

  // _______________ Socket io ________________
  useEffect(() => {
    // Listen for "Task" from the server

    socket.on("taskCreated", (task) => {
      dispatch(getAllProjects());
      toast.info(`New task -> ${task.text}`);
    });
    socket.on("taskDeleted", (task) => {
      dispatch(getAllProjects());
      toast.info(`Task Deleted -> ${task.text}`);
    });
    socket.on("taskUpdated", (task) => {
      dispatch(getAllProjects());
      toast.info(`Task Updated -> ${task.text}`);
    });
    socket.on("taskFlagged", (task) => {
      dispatch(getAllProjects());
      toast.info(`A Task is Flagged`);
    });
    socket.on("taskDraggedInSameColumn", (data) => {
      dispatch(getAllProjects());
      toast.info(`Task rearranged in the ${data?.column?.name} column`);
    });
    socket.on("taskAssigned", (data) => {
      if (data?._id) {
        toast.info(`Task assigned to ${data?.username} `);
      } else {
        toast.info(`Task unassigned`);
      }
      dispatch(getAllProjects());
    });
    socket.on("taskDraggedInDifferentColumn", (data) => {
      toast.info(
        `Task rearranged from the ${data?.sourceColumn?.name} to ${data?.destinationColumn?.name} column`
      );
      dispatch(getAllProjects());
    });
    // _____________ Column _____________
    socket.on("columnCreated", (column) => {
      dispatch(getAllProjects());
      toast.info(`New Column -> ${column?.name} `);
    });
    socket.on("columnDeleted", (column) => {
      dispatch(getAllProjects());
      toast.info(`${column.name} column is deleted`);
    });
    socket.on("columnNameUpdated", (column) => {
      dispatch(getAllProjects());
      toast.info(`Column name is updated to ${column.name}`);
    });
    socket.on("columnLimitUpdated", (column) => {
      dispatch(getAllProjects());
      toast.info(`${column.name} column limit is changed to ${column?.limit}`);
    });
    socket.on("columnDragged", (column) => {
      dispatch(getAllProjects());

      toast.info(`${column.name} column rearranged`);
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskDeleted");
      socket.off("taskUpdated");
      socket.off("taskFlagged");
      socket.off("taskDraggedInSameColumn");
      socket.off("taskDraggedInDifferentColumn");
      socket.off("taskAssigned");
      // _____Column _______
      socket.off("columnCreated");
      socket.off("columnDeleted");
      socket.off("columnNameUpdated");
      socket.off("columnLimitUpdated");
      socket.off("columnDragged");
    };
  }, []);

  // _______________ Get Single Board ________________
  useEffect(() => {
    dispatch(getAllProjects());
  }, []);

  // _______________ Project Owner and Assignee List  ________________
  useEffect(() => {
    const SingleBoard = projects
      ?.find((project) => project._id === projectId)
      ?.boards?.find((board) => board._id === boardId);
    const projectOwnerId = projects?.find(
      (project) => project?._id === projectId
    )?.userId?._id;
    setProjectOwnerId(projectOwnerId || "");

    const projectTeam = projects?.find(
      (project) => project?._id === projectId
    )?.team;
    // project team members

    setAssigneeList(projectTeam);
    setBoard(SingleBoard);
  }, [boardId, projects]);

  //  _______________ Focus on input ________________
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputOpen, inputOpenId]);

  useEffect(() => {
    const handleCloseDropdown = (e) => {
      if (e.target.id !== "menu-button") {
        isOpen && setIsOpen(false);
        toggleAddAssignee && setToggleAddAssignee(false);
      }
    };
    document.addEventListener("click", handleCloseDropdown);
    return () => {
      document.removeEventListener("click", handleCloseDropdown);
    };
  }, [isOpen]);

  // _______________ Get members ________________
  useEffect(() => {
    const alltasksFlat = board?.columns?.map((col) => col.tasks).flat();

    const allmembers = alltasksFlat
      ?.map((task) => task.assignedTo)
      .filter((member) => member !== null);
    const uniqueMembers = [
      ...new Map(allmembers.map((member) => [member._id, member])).values(),
    ];

    setAllTasksMembers(uniqueMembers);
  }, [board]);

  //  _____________ Toggle Create Task Input ________________
  const toggleCreateTask = (colId) => {
    task && setTask("");
    setInputOpen(!inputOpen);
    setInputOpenId(colId);
  };

  //  _______________ Handle Create Task ________________
  const handleCreateTask = async (columnId) => {
    if (task.trim() === "") return toast.error("Task can't be empty");

    const data = await dispatch(CreateNewTask({ text: task, columnId }));

    if (data?.payload?.task) {
      socket.emit("taskCreated", data.payload.task);

      setBoard({
        ...board,
        columns: board?.columns?.map((col) => {
          if (col._id === columnId) {
            return {
              ...col,
              tasks: [...col.tasks, data.payload.task],
            };
          }
          return col;
        }),
      });

      dispatch(getAllProjects());
      setTask("");
      setInputOpenId(null);
      setInputOpen(false);
    }
  };

  //  _______________ Handle Delete Task ________________
  const handleDeleteTask = async (id, columnId) => {
    const data = await dispatch(DeleteTaskById({ id, columnId }));

    if (data?.payload?.task) {
      socket.emit("taskDeleted", data?.payload?.task);

      dispatch(getAllProjects());
      setIsOpen(false);
      setOpenId(null);
    }
  };

  //  _______________ Handle Delete Column ________________
  const handleDeleteColumn = async (columnId) => {
    if (board?.columns?.length === 1) {
      toast.error("You can't delete the last column");
      return;
    }
    const data = await dispatch(
      DeleteColumnById({ columnId, boardId: board._id })
    );

    if (data.payload?.column) {
      socket.emit("columnDeleted", data.payload.column);
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

      const newBoard = {
        ...board,
        columns: allColumns,
      };

      setBoard(newBoard);

      if (allColumns) {
        const data = await dispatch(
          UpdateColumnOrder({
            boardId: board._id,
            columnId: draggableId,
            sourceIndex: source.index,
            destinationIndex: destination.index,
          })
        );

        if (data.payload?.column) {
          socket.emit("columnDragged", data.payload.column);
          dispatch(getAllProjects());
        } else {
          toast.error(data?.payload?.message);
        }
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
          const success = await dispatch(
            UpdateTaskOrder({
              destinationColumnId: DestnationColumn._id,
              sourceColumnId: SourceColumn._id,
              sourceIndex: source.index,
              destinationIndex: destination.index,
              taskId: task._id,
            })
          );
          if (success?.payload) {
            //
            socket.emit("taskDraggedInSameColumn", success?.payload);

            dispatch(getAllProjects());
          }
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
          const success = await dispatch(
            UpdateTaskOrder({
              destinationColumnId: DestnationColumn._id,
              sourceColumnId: SourceColumn._id,
              sourceIndex: source.index,
              destinationIndex: destination.index,
              taskId: task._id,
            })
          );
          if (success?.payload) {
            //
            socket.emit("taskDraggedInDifferentColumn", success?.payload);

            dispatch(getAllProjects());
          }

          // dispatch(getAllProjects());
        }
      }
    }
  };

  // _______________ Handle Change Column Name  ________________
  const handleChangeColumnName = async (columnId, oldColName) => {
    if (!newColName) return toast.error("Please enter a new column name");
    else if (newColName === oldColName) {
      toast.error("Column name can't be same as previous");
      return;
    } else {
      const data = await dispatch(
        UpdateColName({ columnId, newColumnName: newColName })
      );
      if (data?.payload) {
        socket.emit("columnNameUpdated", data?.payload?.column);
        dispatch(getAllProjects());
        setColInputOpen(false);
        setNewColName("");
        setBoard({
          ...board,
          columns: board?.columns?.map((column) => {
            if (column._id === columnId) return { ...column, name: newColName };
            return column;
          }),
        });
      }
    }
  };
  // _______________ Handle Assign Task ________________
  const handleAssignTask = async (member, currentTask, columnId) => {
    if (currentTask?.assignedTo && currentTask?.assignedTo?._id === member._id)
      return toast.error("Task is already assigned to this member");
    setAssignee(member);
    setAllTasksMembers({
      ...allTasksMembers,
      [currentTask._id]: member,
    });
    setBoard({
      ...board,
      columns: board?.columns?.map((col) => {
        if (col._id === columnId) {
          return {
            ...col,
            tasks: col.tasks.map((task) => {
              if (task._id === currentTask._id) {
                return {
                  ...task,
                  assignedTo: member,
                };
              }
              return task;
            }),
          };
        }
        return col;
      }),
    });
    const data = await dispatch(
      AssignTaskToMember({
        taskId: currentTask._id,
        memberId: member._id,
      })
    );
    
    if (data?.payload?.user || data?.payload?.unassigned) {
      if (data?.payload?.user) {
        socket.emit("taskAssigned", data?.payload?.user);
      } else {
        socket.emit("taskAssigned", data?.payload?.unassigned);
      }
      setToggleAddAssignee(false);
      dispatch(getAllProjects());
    } else {
      toast.error(data?.payload?.message);
    }
  };

  return (
    <div className="single-board py-10 px-14 mb-20">
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
            <button
              disabled={projectOwnerId !== myprofile?._id}
              onClick={() => setToggleEditBoard(board ? board : null)}
              title={projectOwnerId !== myprofile?._id ? "Not allowed" : "Edit"}
              className={`${
                projectOwnerId !== myprofile?._id
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:text-indigo-500"
              } ml-5 transition-all duration-200 hover:shadow-lg 
              active:translate-y-[1.4px] `}
            >
              <FaRegEdit size={18} className="text-gray-600" />
            </button>
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

          {/* _______________ TEAM members _______________ */}
          <div className="others flex justify-between items-center">
            <div className="team-members text-xl">
              <div className="no-team flex gap-5 items-center">
                <span className="font-semibold">Team: </span>
                {allTasksMembers?.length > 0 ? (
                  <div className="flex gap-2 items-center">
                    {allTasksMembers?.map((member, index) => {
                      return (
                        <LazyLoadImage
                          key={`${index}-${member?._id}`}
                          src={member?.profilePicture}
                          effect="blur"
                          title={member?.email}
                          alt="Profile Picture"
                          className="rounded-full border-2"
                          width={30}
                          height={30}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-400">
                    No tasks are assigned to team members
                  </span>
                )}
                <div
                  title="To add more team members, go back to project and click on edit and add more members"
                  className="info cursor-pointer ml-10"
                >
                  <MdInfoOutline size={20} className="text-gray-500" />
                </div>
              </div>
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
                  ? "flex overflow-x-auto w-[117rem]"
                  : "grid grid-cols-3 gap-10 w-fit"
              } gap-10 my-10  pb-5`}
            >
              {board?.columns?.map((col, index) => {
                return (
                  <Draggable
                    key={`${col._id}-${index}`}
                    draggableId={col._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`cursor-default h-fit ${
                          columnAlignment == "row"
                            ? "min-w-[30rem] max-w-[30rem]"
                            : "w-[30rem]"
                        }  shadow-indigo-100 rounded-md px-5 py-6 flex flex-col gap-2`}
                      >
                        {/* _____ Column Header Part ____ */}
                        <div
                          onMouseOver={() =>
                            !colInputOpen && setEditColId(col._id)
                          }
                          className={`border-b-4 my-2 shadow-md  ${
                            col?.limit !== null &&
                            col.limit < col.tasks.length &&
                            "bg-red-100"
                          } ${
                            col.name == "Todo"
                              ? "border-blue-100"
                              : col.name == "In Progress"
                              ? "border-indigo-100"
                              : col.name.toLowerCase().includes("done") ||
                                col.name.toLowerCase().includes("finish") ||
                                col.name.toLowerCase().includes("complet")
                              ? "border-green-100"
                              : "border-gray-100"
                          } ${
                            colInputOpen && editColId == col._id
                              ? "py-3 px-4"
                              : "p-4"
                          } flex items-center justify-between`}
                        >
                          {/* ________ COL EDIT INPUT ______ */}
                          {colInputOpen && editColId == col._id ? (
                            <div className="input-box rounded-lg w-full bg-white flex gap-2 relative">
                              <>
                                <input
                                  className="text-xl w-full  border-2 border-gray-200 px-3 py-[4.5px] rounded-lg outline-none"
                                  type="text"
                                  value={newColName || col.name}
                                  onChange={(e) =>
                                    setNewColName(e.target.value)
                                  }
                                />
                              </>
                              {/* ______ SAVE CANCEL BUTTONS FOR NEW COL NAME _____ */}
                              <div className="flex gap-3 items-center absolute top-14  right-0">
                                <button
                                  onClick={() => {
                                    setColInputOpen(false);
                                    setNewColName("");
                                  }}
                                  className="outline-none border-2 bg-gray-100 text-gray-600 border-gray-200 shadow-sm hover:shadow-md p-3 text-xl rounded-lg "
                                >
                                  <IoClose size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleChangeColumnName(col._id, col.name)
                                  }
                                  className="outline-none bg-indigo-100 text-indigo-600 border-2 border-indigo-200 shadow-sm hover:shadow-md p-3 text-xl rounded-lg "
                                >
                                  {columnLoading ? (
                                    <AiOutlineLoading3Quarters
                                      className="animate-spin"
                                      size={16}
                                    />
                                  ) : (
                                    <IoCheckmark size={14} />
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            // ________ Column Name _______
                            <div className="text-xl font-bold flex gap-5 h-10 items-center text-gray-500">
                              <span>{col.name}!</span>
                              {editColId == col._id && (
                                <span
                                  onClick={() => {
                                    setColInputOpen(true);
                                  }}
                                  className="cursor-pointer p-3  hover:bg-gray-200 rounded-lg"
                                >
                                  <FaPencilAlt size={12} />
                                </span>
                              )}
                            </div>
                          )}

                          {/* _________ Column  Limit _______*/}
                          <span
                            className={`cursor-pointer flex  ${
                              colInputOpen && editColId == col._id
                                ? "gap-3"
                                : "gap-10"
                            }`}
                          >
                            {col.limit && (
                              <div
                                className={`limit ${
                                  colInputOpen && editColId == col._id
                                    ? "text-sm p-[1.5px] font-semibold hidden"
                                    : "text-lg px-[5px] py-[1.4px] font-extrabold"
                                } flex items-center   rounded-md ${
                                  col?.limit !== null &&
                                  col.limit < col.tasks.length
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-500"
                                } `}
                              >
                                MAX {col.limit}
                              </div>
                            )}
                            <ColumnEditorTool
                              setColLimit={setColLimit}
                              handleDeleteColumn={handleDeleteColumn}
                              isOpen={isOpen}
                              setIsOpen={setIsOpen}
                              col={col}
                              projectOwnerId={projectOwnerId}
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
                              : col.name.toLowerCase().includes("progres")
                              ? "bg-indigo-50"
                              : col.name.toLowerCase().includes("done") ||
                                col.name.toLowerCase().includes("finish") ||
                                col.name.toLowerCase().includes("complet")
                              ? "bg-green-50"
                              : "bg-gray-50"
                          }
                          
                           rounded-lg min-h-[50vh] shadow-md py-2 px-3 `}
                        >
                          <Droppable
                            droppableId={col.name}
                            key={`${col._id}-${index}-${col.name}`}
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
                                      key={`${task._id}-${index}-${index * 2}`}
                                      draggableId={task?._id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          onMouseOver={() =>
                                            !isOpen && setOpenId(task._id)
                                          }
                                          onMouseLeave={() => {
                                            !isOpen && setOpenId(null);
                                          }}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`task cursor-default border-2 rounded-lg
                                            px-4 py-1 flex flex-col gap-4 ${
                                              snapshot.isDragging
                                                ? "bg-blue-100 shadow-lg border-2 border-blue-300"
                                                : task?.flagged
                                                ? "bg-yellow-100 border-yellow-200"
                                                : "bg-white border-indigo-100"
                                            }`}
                                        >
                                          <div className="flex justify-between items-center">
                                            {/* _____ Labels ____ */}
                                            <div className="labels flex flex-wrap gap-2 py-3">
                                              <span
                                                className={`inline-flex text-sm items-center rounded-md ${
                                                  col.name == "Todo"
                                                    ? badgeColors.blue.bg
                                                    : col.name
                                                        .toLowerCase()
                                                        .includes("progres")
                                                    ? badgeColors.yellow.bg
                                                    : col.name
                                                        .toLowerCase()
                                                        .includes(
                                                          "done" ||
                                                            "finish" ||
                                                            "complet"
                                                        ) &&
                                                      badgeColors.green.bg
                                                } px-2 py-1 text-lg capitalize font-medium ${
                                                  col.name == "Todo"
                                                    ? badgeColors.blue.text
                                                    : col.name
                                                        .toLowerCase()
                                                        .includes("progres")
                                                    ? badgeColors.yellow.text
                                                    : col.name
                                                        .toLowerCase()
                                                        .includes(
                                                          "done" ||
                                                            "finish" ||
                                                            "complet"
                                                        ) &&
                                                      badgeColors.green.text
                                                } ring-1 ring-inset ${
                                                  col.name == "Todo"
                                                    ? badgeColors.blue.ring
                                                    : col.name
                                                        .toLowerCase()
                                                        .includes("progress")
                                                    ? badgeColors.yellow.ring
                                                    : col.name
                                                        .toLowerCase()
                                                        .includes(
                                                          "done" ||
                                                            "finish" ||
                                                            "complet"
                                                        ) &&
                                                      badgeColors.green.ring
                                                }`}
                                              >
                                                {col.name}
                                              </span>

                                              {projectOwnerId ===
                                                myprofile?._id &&
                                                task?.createdBy !==
                                                  myprofile?._id && (
                                                  <span className="bg-yellow-100 text-yellow-500 ring-1 ring-[#f4e8bd] rounded-md px-1 flex items-center">
                                                    Issue
                                                  </span>
                                                )}

                                              {task?.labels?.map(
                                                (label, index) => {
                                                  return (
                                                    <span
                                                      key={`${label}-${index}`}
                                                      className={`inline-flex items-center rounded-md  px-2 py-1 text-sm capitalize font-medium text-purple border-[.5px] border-gray-200`}
                                                    >
                                                      {label}
                                                    </span>
                                                  );
                                                }
                                              )}
                                            </div>
                                            {/* _______ ThreeDots ______ */}
                                            {openId === task._id && (
                                              <span className="cursor-pointer h-full">
                                                <TaskEditorTool
                                                  handleDeleteTask={
                                                    handleDeleteTask
                                                  }
                                                  projectOwnerId={
                                                    projectOwnerId
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
                                            )}
                                          </div>
                                          {/* _____ Text ____ */}
                                          <div className="cursor-default task-name items-center text-xl my-1 rounded-lg flex gap-5 ">
                                            {task.text}
                                          </div>
                                          {/* _______ Extras ______ */}
                                          <div className="extras flex justify-end">
                                            <div className="flex gap-5 items-center">
                                              {task?.flagged && (
                                                <div
                                                  className="flagged justify-end flex cursor-pointer"
                                                  title="flagged"
                                                >
                                                  <IoFlag
                                                    size={12}
                                                    color="red"
                                                  />
                                                </div>
                                              )}
                                              {/* _______________ Task Assigning _____________ */}
                                              <div
                                                id="menu-button"
                                                className="assign-task relative cursor-pointer"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setToggleAddAssignee(
                                                    !toggleAddAssignee
                                                  );
                                                  setTaskId(task._id);
                                                }}
                                              >
                                                {task?.assignedTo?._id ? (
                                                  <LazyLoadImage
                                                    src={
                                                      task?.assignedTo
                                                        ?.profilePicture
                                                    }
                                                    effect="blur"
                                                    title={`Assigned to ${task?.assignedTo?.email}`}
                                                    alt="Profile Picture"
                                                    className="rounded-full border-2"
                                                    width={30}
                                                    height={30}
                                                  />
                                                ) : (
                                                  <span
                                                    title="Unassigned"
                                                    className="cursor-pointer flex gap-2 items-center"
                                                  >
                                                    {assignLoading &&
                                                      taskId === task._id && (
                                                        <AiOutlineLoading3Quarters
                                                          className="animate-spin mb-2 text-gray-400"
                                                          size={16}
                                                        />
                                                      )}
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      viewBox="0 0 64 80"
                                                      x="0px"
                                                      width={27}
                                                      y="0px"
                                                      fill="#525d70"
                                                    >
                                                      <path d="M32,5A27,27,0,0,0,12.5,50.65c.47.51,1,1,1.5,1.46a26.94,26.94,0,0,0,36,0q.81-.7,1.53-1.47A27,27,0,0,0,32,5ZM50.78,48.59C47.62,39.69,40.24,33.83,32,33.83S16.34,39.72,13.21,48.58a25.07,25.07,0,1,1,37.57,0Z" />
                                                      <path d="M32,10.75a9.84,9.84,0,1,0,9.84,9.83A9.84,9.84,0,0,0,32,10.75Z" />
                                                    </svg>
                                                  </span>
                                                )}
                                                {toggleAddAssignee &&
                                                  taskId === task._id && (
                                                    <div id="menu-button">
                                                      <div className="absolute border-l-2 border-t-2 border-gray-200 drop-shadow-lg bg-white w-5 h-10 right-[1.15rem] top-11 rotate-45"></div>
                                                      <div className="absolute z-50 drop-shadow-xl top-14 right-0 w-[20rem] border-2 border-gray-100   overflow-y-hidden bg-white p-3 rounded-lg ">
                                                        <div className="flex flex-col gap-2 h-[10rem] py-2 overflow-y-auto assignee-list-scroll">
                                                          {/* Make it unassigned  */}
                                                          {task?.assignedTo
                                                            ?._id ? (
                                                            <div
                                                              onClick={() =>
                                                                handleAssignTask(
                                                                  {},
                                                                  task,
                                                                  col._id
                                                                )
                                                              }
                                                              title="Unassign"
                                                              className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-md"
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 64 80"
                                                                x="0px"
                                                                width={27}
                                                                y="0px"
                                                                fill="#525d70"
                                                              >
                                                                <path d="M32,5A27,27,0,0,0,12.5,50.65c.47.51,1,1,1.5,1.46a26.94,26.94,0,0,0,36,0q.81-.7,1.53-1.47A27,27,0,0,0,32,5ZM50.78,48.59C47.62,39.69,40.24,33.83,32,33.83S16.34,39.72,13.21,48.58a25.07,25.07,0,1,1,37.57,0Z" />
                                                                <path d="M32,10.75a9.84,9.84,0,1,0,9.84,9.83A9.84,9.84,0,0,0,32,10.75Z" />
                                                              </svg>

                                                              <span className="capitalize">
                                                                Unassign
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            // {/* assign to me */}
                                                            <div
                                                              onClick={() =>
                                                                handleAssignTask(
                                                                  myprofile,
                                                                  task,
                                                                  col._id
                                                                )
                                                              }
                                                              title={`Assign to ${myprofile?.email}`}
                                                              className="flex items-center gap-3 border-2 bg-gray-200 hover:bg-gray-100 p-1 rounded-md"
                                                            >
                                                              <LazyLoadImage
                                                                src={
                                                                  myprofile?.profilePicture ||
                                                                  "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1725655669.jpg"
                                                                }
                                                                effect="blur"
                                                                alt="Profile Picture"
                                                                className="rounded-full "
                                                                width={30}
                                                                height={30}
                                                              />
                                                              <span className="capitalize">
                                                                Assign to me
                                                              </span>
                                                            </div>
                                                          )}
                                                          {/* assign to team members */}
                                                          {assigneeList?.map(
                                                            (member, idx) => {
                                                              return (
                                                                <div
                                                                  key={`${member._id}-${idx}-${task._id}`}
                                                                  onClick={() =>
                                                                    handleAssignTask(
                                                                      member,
                                                                      task,
                                                                      col._id
                                                                    )
                                                                  }
                                                                  title={`Assign to ${member?.email}`}
                                                                  className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-md"
                                                                >
                                                                  <LazyLoadImage
                                                                    src={
                                                                      member?.profilePicture ||
                                                                      "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1725655669.jpg"
                                                                    }
                                                                    effect="blur"
                                                                    alt="Profile Picture"
                                                                    className="rounded-full"
                                                                    width={30}
                                                                    height={30}
                                                                  />
                                                                  <span className="capitalize">
                                                                    {
                                                                      member?.username
                                                                    }
                                                                  </span>
                                                                </div>
                                                              );
                                                            }
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                              </div>
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
                                    : col.name
                                        .toLowerCase()
                                        .includes("finish") ||
                                      col.name.toLowerCase().includes("done") ||
                                      col.name.toLowerCase().includes("complet")
                                    ? "bg-green-100 text-green-600 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                }border-2 h-fit shadow-sm hover:shadow-md p-3 text-xl rounded-lg flex justify-center`}
                              >
                                {loading ? (
                                  <AiOutlineLoading3Quarters
                                    className="animate-spin"
                                    size={16}
                                  />
                                ) : col?.createdBy === myprofile?._id ? (
                                  "Add Task"
                                ) : (
                                  "Create Issue"
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
                              } border-2 shadow-sm hover:shadow-md p-3 text-xl rounded-lg `}
                            >
                              {inputOpen && inputOpenId == col._id
                                ? "Cancel"
                                : col?.createdBy === myprofile?._id
                                ? "Add Task"
                                : "Create Issue"}
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
            setEditTaskId={setEditTaskId}
            editTaskId={editTaskId}
            TaskToEdit={TaskToEdit}
            setTaskToEdit={setTaskToEdit}
            board={board}
            setBoard={setBoard}
          />
        )}
        {colLimit && (
          <ColumnLimitOverlay
            colLimit={colLimit}
            setColLimit={setColLimit}
            board={board}
            setBoard={setBoard}
          />
        )}
        {toggleEditBoard && (
          <EditBoardOverlay
            toggleEditBoard={toggleEditBoard}
            setToggleEditBoard={setToggleEditBoard}
            board={board}
            setBoard={setBoard}
            setAllProjects={setAllProjects}
            allProjects={allProjects}
          />
        )}
      </DragDropContext>
    </div>
  );
};

export default SingleBoard;
