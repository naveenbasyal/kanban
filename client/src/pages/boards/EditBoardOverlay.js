import React, { useCallback, useEffect } from "react";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CreateNewBoard,
  UpdateBoardNameOrDescription,
} from "../../store/slices/boardSlice";
import { Dialog, Transition } from "@headlessui/react";

import {
  getAllProjects,
  getAllUserProjects,
} from "../../store/slices/projectSlice";
import { useLocation } from "react-router-dom";

// __________ Socket io ___________
import io from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(`${process.env.REACT_APP_SERVER_URL}`, {
  transports: ["websocket"],
});

const EditBoardOverlay = ({
  setToggleEditBoard,
  toggleEditBoard: { title, description, _id, status },
  board,
  setProject,
  project,
  setBoard,
}) => {
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);
  const location = useLocation();
  const { loading } = useSelector((state) => state.board);

  const [values, setValues] = useState({
    title: title,
    description: description,
    status: status,
  });

  const handleUpdateBoard = async () => {
    if (location.pathname.includes("board")) {
      setBoard({
        ...board,
        status: values.status,
        title: values.title,
        description: values.description,
      });
    } else {
      setProject({
        ...project,
        boards: project?.boards.map((b) =>
          b._id === _id
            ? { ...b, status: values.status, title: values.title }
            : b
        ),
      });
    }
    setToggleEditBoard(false);
    const data = await dispatch(
      UpdateBoardNameOrDescription({
        boardId: _id,
        title: values.title,
        description: values.description,
        status: values.status,
      })
    );
    if (data.payload?.board) {
      socket.emit("boardUpdated", data.payload?.board);
      dispatch(getAllProjects());
      dispatch(getAllUserProjects());
      setValues({ title: "", description: "" });
    } else {
      toast.error(data?.payload?.message);
    }
  };

  return (
    <>
      <Transition.Root show={_id !== null ? true : false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setToggleEditBoard}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:backdrop-blur-md dark:bg-opacity-0 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4  sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative p-8 flex flex-col justify-between gap-10 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all  sm:my-8 sm:w-full max-w-3xl">
                  <h3 className=" text-3xl font-bold text-heading">
                    Edit Board
                  </h3>
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="board-name"
                        className="text-xl font-semibold text-heading"
                      >
                        Board name
                      </label>
                      <input
                        type="text"
                        name="board-name"
                        id="board-name"
                        value={values.title}
                        onChange={(e) =>
                          setValues({ ...values, title: e.target.value })
                        }
                        placeholder="Board name"
                        className="border border-gray-300 rounded-md px-4 py-4 text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="board-description"
                        className="text-xl font-semibold text-heading"
                      >
                        Board description
                      </label>
                      <textarea
                        rows={3}
                        value={values.description}
                        onChange={(e) =>
                          setValues({ ...values, description: e.target.value })
                        }
                        placeholder="Board description"
                        name="board-description"
                        id="board-description"
                        className="border border-gray-300 rounded-md px-4 py-4 text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* board status change */}
                      <label
                        htmlFor="board-status"
                        className="text-xl font-semibold text-heading"
                      >
                        Board status
                      </label>
                      <select
                        value={values.status}
                        onChange={(e) =>
                          setValues({ ...values, status: e.target.value })
                        }
                        name="board-status"
                        id="board-status"
                        className="border cursor-pointer border-gray-300 rounded-md px-4 py-4 text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="finished">Finished</option>
                      </select>
                    </div>
                  </div>

                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={`inline-flex w-full justify-center rounded-md ${
                        loading ? "bg-gray-300" : "bg-red-600 "
                      } px-5 py-4 text-xl font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto`}
                      onClick={handleUpdateBoard}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-4 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setToggleEditBoard(false);
                        // setValues({ title: "", description: "" });
                      }}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default React.memo(EditBoardOverlay);
