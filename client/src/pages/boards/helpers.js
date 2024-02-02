import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { ThreeDots } from "../../components/svg";
import { FaRegEdit, FaRegFlag } from "react-icons/fa";
import { MdLabelImportantOutline } from "react-icons/md";
import { useSelector } from "react-redux";

export const ColumnEditorTool = ({
  isOpen,

  setIsOpen,
  col,
  openId,
  setOpenId,
  loading,
  handleDeleteColumn,
}) => {
  const { loading: colLoading } = useSelector((state) => state?.column);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={(e) => {
            setIsOpen(!isOpen);
            setOpenId(col._id);
          }}
          type="button"
          className={`inline-flex ${
            isOpen && openId == col._id
              ? " bg-indigo-100"
              : "bg-transparent text-gray-900 outline-none  "
          } border-none w-full justify-center gap-x-1.5  rounded-md  px-3 py-2 text-sm font-semibold   hover:bg-gray-50`}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <ThreeDots color={isOpen && openId == col._id ? "indigo" : "gray"} />
        </button>
      </div>
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

          <span
            onClick={() => handleDeleteColumn(col._id)}
            className="text-red-500 flex items-center gap-3 px-4 py-2 text-xl hover:bg-gray-100"
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
          </span>
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
}) => {
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={(e) => {
            setIsOpen(!isOpen);
            setOpenId(task._id);
          }}
          type="button"
          className={`inline-flex ${
            isOpen && openId == task._id
              ? " bg-indigo-100"
              : "bg-transparent text-gray-900 outline-none  "
          } border-none w-full justify-center gap-x-1.5  rounded-md  px-3 py-2 text-sm font-semibold   hover:bg-gray-50`}
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
          <span
            onClick={() => {
              setEditTaskId(task._id);
              setTaskToEdit(task);
              setIsOpen(false);
            }}
            className="flex gap-3 hover:text-indigo-500 text-gray-700  items-center px-4 py-2 text-xl hover:bg-gray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            <FaRegEdit size={16} /> Edit
          </span>
          <span
            onClick={() => {
              setIsOpen(false);
            }}
            className="flex gap-3 hover:text-indigo-500 text-gray-700  items-center px-4 py-2 text-xl hover:bg-gray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            <FaRegFlag size={13} className="font-bold" />
            Add Flag
          </span>

          <span
            onClick={() => handleDeleteTask(task._id, col._id)}
            className="text-red-500 flex items-center gap-3 px-4 py-2 text-xl hover:bg-gray-100"
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
          </span>
        </div>
      </div>
    </div>
  );
};
