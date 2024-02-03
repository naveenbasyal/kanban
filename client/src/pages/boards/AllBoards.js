import React, { memo, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ActiveIndicator,
  FinishedIndicator,
  PausedIndicator,
  ThreeDots,
} from "../../components/svg";
import { badgeColors } from "../../App";
import { Link } from "react-router-dom";
import { HiCursorArrowRipple } from "react-icons/hi2";
import { FaRegCopy, FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import DeleteBoard from "./DeleteBoard";
import EditBoardOverlay from "./EditBoardOverlay";

const AllBoards = ({ boards, project, setProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [boardId, setBoardId] = useState(null);

  // Edit Board
  const [toggleEditBoard, setToggleEditBoard] = useState(null);

  return (
    <div className="all-boards">
      {/* ---------Boards Mappping---------- */}
      <div className="grid grid-cols-3 gap-10 my-10 w-fit">
        {boards?.map((board) => {
          return (
            <div
              key={board._id}
              className="w-[28rem] h-[16rem] shadow-board border-[1px] border-[#F2F2F2] rounded-md px-5 py-6 flex flex-col gap-2"
            >
              <div className="nav-section flex justify-between w-full items-center ">
                {/* _______ Board Status _____ */}
                <span
                  className={`inline-flex text-sm items-center rounded-md ${
                    board.status == "active"
                      ? badgeColors.blue.bg
                      : board.status == "paused"
                      ? badgeColors.yellow.bg
                      : board.status == "finished" && badgeColors.green.bg
                  } px-2 py-1 text-lg capitalize font-medium ${
                    board.status == "active"
                      ? badgeColors.blue.text
                      : board.status == "paused"
                      ? badgeColors.yellow.text
                      : board.status == "finished" && badgeColors.green.text
                  } ring-1 ring-inset ${
                    board.status == "active"
                      ? badgeColors.blue.ring
                      : board.status == "paused"
                      ? badgeColors.yellow.ring
                      : board.status == "finished" && badgeColors.green.ring
                  }`}
                >
                  {board.status}
                </span>

                <span className="cursor-pointer ">
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(!isOpen);
                          setOpenId(board._id);
                        }}
                        type="button"
                        className={`inline-flex ${
                          isOpen && openId == board._id
                            ? " bg-indigo-100"
                            : "bg-transparent text-gray-900 outline-none  "
                        } border-none w-full justify-center gap-x-1.5 h-8 items-center  rounded-md  px-3 py-2 text-sm font-semibold   hover:bg-gray-50`}
                        id="menu-button"
                        aria-expanded="true"
                        aria-haspopup="true"
                      >
                        <ThreeDots
                          color={
                            isOpen && openId == board._id ? "indigo" : "gray"
                          }
                        />
                      </button>
                    </div>

                    <div
                      className={`absolute ${
                        isOpen && openId == board._id ? "block" : "hidden"
                      } right-0 z-10 mt-2 w-56 py-4
                          transition-all duration-200 ease-in-out
                           origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                      tabIndex="-1"
                    >
                      <div className="py-3 flex flex-col gap-2" role="none">
                        {/* Board status change */}
                        <span
                          className="flex gap-3 text-gray-700  items-center px-4 py-2 text-xl "
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-0"
                        >
                          {board.status == "active" ? (
                            <div className="span flex gap-2 items-center transition-colors duration-200 hover:text-blue-500">
                              <ActiveIndicator width={"14px"} height={"14px"} />
                              Active
                            </div>
                          ) : board.status == "paused" ? (
                            <div className="span flex gap-2 items-center transition-colors duration-200 hover:text-yellow-500">
                              <PausedIndicator width={"14px"} height={"14px"} />{" "}
                              Paused
                            </div>
                          ) : (
                            board.status == "finished" && (
                              <div className="span flex gap-2 items-center transition-colors duration-200 hover:text-green-500">
                                <FinishedIndicator
                                  width={"14px"}
                                  height={"14px"}
                                />
                                Finished
                              </div>
                            )
                          )}
                        </span>

                        <Link
                          to={`board/${board?._id}`}
                          className="flex items-center gap-3 hover:text-indigo-500 text-gray-700  px-4 py-2 text-xl hover:bg-gray-100"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-1"
                        >
                          <HiCursorArrowRipple size={16} /> Open Board
                        </Link>
                        <span
                          onClick={() => {
                            setToggleEditBoard(board);
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
                            navigator.clipboard.writeText(board._id);
                            toast.info(`Board id copied to clipboard`);
                            setIsOpen(false);
                          }}
                          className="flex gap-3 hover:text-indigo-500 text-gray-700  items-center px-4 py-2 text-xl hover:bg-gray-100"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-0"
                        >
                          <FaRegCopy size={16} /> Copy board id
                        </span>
                        <span
                          onClick={() => {
                            setBoardId(board._id);
                            setIsOpen(false);
                          }}
                          className="text-red-500 flex items-center gap-3 px-4 py-2 text-xl hover:bg-gray-100"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-0"
                        >
                          <AiOutlineDelete size={16} />
                          Delete Board
                        </span>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <Link to={`board/${board._id}`} className="flex flex-col gap-2">
                <div className="board-name flex items-center gap-3 text-2xl capitalize font-semibold">
                  {board.status == "active" ? (
                    <ActiveIndicator width="20" height="20" />
                  ) : board.status == "paused" ? (
                    <PausedIndicator width="20" height="20" />
                  ) : (
                    board.status == "finished" && (
                      <FinishedIndicator width="20" height="20" />
                    )
                  )}
                  {board.title}
                </div>
                <div className="createdAt text-md text-[#807C8D]">
                  {/* formatted date Jan 1, 2024 */}
                  {new Date(board.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {"  - Present"}
                </div>
                <div className="board-description text-xl">
                  {board.description}
                </div>
                <div className="board-progress h-2 bg-gray-100 rounded-lg my-2">
                  <div
                    className={` h-2 ${
                      board.status == "active"
                        ? "bg-[#0047ff]"
                        : board.status == "paused"
                        ? "bg-[#ecb80f]"
                        : board.status == "finished" && "bg-[#2dcd5b]"
                    }
                    } rounded-lg w-1/6`}
                  ></div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      {boardId ? (
        <DeleteBoard
          boardId={boardId}
          setBoardId={setBoardId}
          title={boards.filter((board) => board._id === boardId)}
        />
      ) : null}
      {toggleEditBoard && (
        <EditBoardOverlay
          setToggleEditBoard={setToggleEditBoard}
          toggleEditBoard={toggleEditBoard}
        />
      )}
    </div>
  );
};

export default memo(AllBoards);
