import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { ThreeDots } from "../../components/svg";
import { FaRegEdit, FaRegFlag } from "react-icons/fa";
import { MdLabelImportantOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskById } from "../../store/slices/TaskSlice";
import { getAllProjects } from "../../store/slices/projectSlice";
import { useState } from "react";
import { useUser } from "../../Context/userContext";
import io from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});
export const ColumnEditorTool = ({
  isOpen,
  setColLimit,
  setIsOpen,
  col,
  openId,
  setOpenId,
  loading,
  handleDeleteColumn,
  projectOwnerId,
}) => {
  const { loading: colLoading } = useSelector((state) => state?.column);
  const { user } = useUser();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          setOpenId(col._id);
        }}
        type="button"
        className={`inline-flex ${
          isOpen && openId == col._id
            ? " bg-indigo-100"
            : "bg-transparent text-gray-900 outline-none  "
        } border-none w-full h-10 items-center justify-center gap-x-1.5  rounded-md  px-3 py-2 text-sm font-semibold   hover:bg-gray-50`}
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
      >
        <ThreeDots color={isOpen && openId == col._id ? "indigo" : "gray"} />
      </button>

      <div
        className={`absolute ${
          isOpen && openId == col._id ? "block" : "hidden"
        } right-0 z-10 mt-2 w-56 py-4
                    transition-all duration-200 ease-in-out
                    origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        <div className="py-3 flex flex-col gap-2" role="none">
          <span
            onClick={() => {
              setColLimit(col);
              setIsOpen(false);
            }}
            className="flex gap-3 hover:text-indigo-500 text-gray-700  items-center px-4 py-2 text-xl hover:bg-gray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            <FaRegFlag size={13} className="font-bold" />
            Set Limit
          </span>

          <button
            disabled={
              col?.createdBy !== user?._id && projectOwnerId !== user?._id
                ? true
                : (col?.createdBy === user?._id ||
                    projectOwnerId === user?._id) &&
                  false
            }
            onClick={() => handleDeleteColumn(col._id)}
            className={`${
              col?.createdBy !== user?._id && projectOwnerId !== user?._id
                ? "cursor-not-allowed bg-gray-100 text-gray-300"
                : (col?.createdBy === user?._id ||
                    projectOwnerId === user?._id) &&
                  "text-red-500 hover:bg-gray-100"
            } 
            flex items-center gap-3 px-4 py-2 text-xl `}
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            {colLoading ? (
              <AiOutlineLoading3Quarters size={16} className="animate-spin" />
            ) : (
              <AiOutlineDelete size={16} />
            )}
            Delete column
          </button>
        </div>
      </div>
    </div>
  );
};
export const TaskEditorTool = ({
  isOpen,
  setIsOpen,
  task,
  col,
  setTaskToEdit,
  setEditTaskId,
  editTaskId,
  openId,
  setOpenId,
  loading,
  handleDeleteTask,
  projectOwnerId,
}) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { editLoading } = useSelector((state) => state?.task);

  const handleAddFlag = async () => {
    const data = await dispatch(
      updateTaskById({
        taskId: task._id,
        text: task.text,
        labels: task.labels,
        flagged: !task.flagged,
      })
    );
    if (data?.payload?.updatedTask) {
      socket.emit("taskFlagged", data?.payload?.updatedTask);

      dispatch(getAllProjects());
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
            setOpenId(task._id);
          }}
          type="button"
          className={`inline-flex ${
            isOpen && openId == task._id
              ? " bg-indigo-100"
              : "bg-transparent text-gray-900 outline-none  "
          } border-none w-full h-10 items-center justify-center gap-x-1.5  rounded-md  px-3 py-2 text-sm font-semibold   hover:bg-gray-50`}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <ThreeDots color={isOpen && openId == task._id ? "indigo" : "gray"} />
        </button>
      </div>
      <div
        className={`absolute ${
          isOpen && openId == task._id ? "block" : "hidden"
        } right-0 z-10 mt-2 w-56 py-4
transition-all duration-200 ease-in-out
origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        <div className="py-3 flex flex-col gap-2" role="none">
          <button
            disabled={
              task?.createdBy !== user?._id && projectOwnerId !== user?._id
                ? true
                : (task?.createdBy === user?._id ||
                    projectOwnerId === user?._id) &&
                  false
            }
            onClick={() => {
              setEditTaskId(task._id);
              setTaskToEdit(task);
              !editLoading && setIsOpen(false);
            }}
            className={`${
              task?.createdBy !== user?._id && projectOwnerId !== user?._id
                ? "cursor-not-allowed bg-gray-100 text-gray-300"
                : (task?.createdBy === user?._id ||
                    projectOwnerId === user?._id) &&
                  "text-gray-700 hover:text-indigo-500"
            } flex gap-3  items-center px-4 py-2 
             text-xl hover:bg-gray-100`}
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            <FaRegEdit size={16} /> Edit
          </button>
          <span
            onClick={handleAddFlag}
            className="flex gap-3 hover:text-indigo-500 text-gray-700  items-center px-4 py-2 text-xl hover:bg-gray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            {editLoading ? (
              <AiOutlineLoading3Quarters size={16} className="animate-spin" />
            ) : (
              <FaRegFlag size={13} className="font-bold" />
            )}
            {task.flagged ? "Remove Flag" : "Add Flag"}
          </span>

          <button
            disabled={
              task?.createdBy !== user?._id && projectOwnerId !== user?._id
                ? true
                : (task?.createdBy === user?._id ||
                    projectOwnerId === user?._id) &&
                  false
            }
            onClick={() => handleDeleteTask(task._id, col._id)}
            className={`${
              task?.createdBy !== user?._id && projectOwnerId !== user?._id
                ? "cursor-not-allowed bg-gray-100 text-gray-300"
                : (task?.createdBy === user?._id ||
                    projectOwnerId === user?._id) &&
                  "text-red-500"
            }  flex items-center gap-3 px-4 py-2 text-xl
             hover:bg-gray-100`}
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            {loading ? (
              <AiOutlineLoading3Quarters size={16} className="animate-spin" />
            ) : (
              <AiOutlineDelete size={16} />
            )}
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
