import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { DeleteBoardById } from "../../store/slices/boardSlice";
import { useParams } from "react-router-dom";
import {
  getAllProjects,
  getAllUserProjects,
} from "../../store/slices/projectSlice";

// __________ Socket io ___________
import io from "socket.io-client";

const socket = io(`${process.env.REACT_APP_SERVER_URL}`, {
  transports: ["websocket"],
});

const DeleteProjectOverlay = ({
  title,
  info,
  boardId,
  setBoardId,
  deleteProjectFn,
}) => {
  const dispatch = useDispatch();

  const projectId = useParams()?.projectId;
  const { loading } = useSelector((state) => state.board);
  const [open, setOpen] = useState(false);

  const deleteBoardFn = async () => {
    const data = await dispatch(DeleteBoardById({ id: boardId, projectId }));

    if (data.payload?.board) {
      socket.emit("boardDeleted", data.payload?.board);
      setOpen(false);
      setBoardId(null);
      dispatch(getAllProjects());
      dispatch(getAllUserProjects());
    } else {
      toast.info(data.payload.message);
    }
  };
  const cancelButtonRef = useRef(null);
  

  return (
    <Transition.Root show={boardId ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
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
          <div className="fixed inset-0 bg-gray-500 dark:backdrop-blur-md dark:bg-opacity-0  bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex flex-col justify-between gap-5 min-h-4/5 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all py-5 sm:my-8 sm:w-full max-w-3xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"></div>
                    <div className="py-1 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-3xl flex items-center   font-semibold leading-6 text-gray-900"
                      >
                        Delete Board
                        <span className="text-red-700 ml-3">
                          {title[0].title}
                        </span>
                      </Dialog.Title>
                      <div className="mt-5">
                        <p className="text-xl text-gray-500"></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex lg:w-[7rem] justify-center rounded-md bg-red-600 px-5 py-4 text-xl font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3  sm:w-auto"
                    onClick={deleteBoardFn}
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters
                        size={16}
                        className="animate-spin text-white "
                      />
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-4 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      setBoardId(null);
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
  );
};

export default React.memo(DeleteProjectOverlay);
