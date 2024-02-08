import React, { useEffect } from "react";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Dialog, Transition } from "@headlessui/react";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { UpdateColLimit } from "../../../store/slices/columnSlice";
import { getAllProjects } from "../../../store/slices/projectSlice";

// __________ Socket io ___________
import io from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

const ColumnLimitOverlay = ({
  board,
  setBoard,
  colLimit: { limit, _id },
  setColLimit,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const { loading } = useSelector((state) => state.column);
  const [values, setValues] = useState({
    limit: limit,
  });

  const handleUpdateLimit = async () => {
    const data = await dispatch(
      UpdateColLimit({ columnId: _id, limit: values.limit })
    );

    if (data.payload?.column) {
      socket.emit("columnLimitUpdated", data?.payload?.column);
      setColLimit(null);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col._id === _id) {
            return { ...col, limit: values.limit };
          }
          return col;
        }),
      });
      dispatch(getAllProjects());
    } else {
      toast.error(data?.payload?.message);
    }
  };

  return (
    <>
      <Transition.Root show={_id ? true : false} as={Fragment}>
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                    <div className="flex flex-col gap-6">
                      <div className="py-1 text-center">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl flex items-center   font-bold leading-6 text-heading"
                        >
                          Column Limit
                        </Dialog.Title>
                        <div className="message text-xl text-purple p-2 mt-4">
                          We'll highlight this column if the number of issues in
                          it passes this limit.
                        </div>

                        {/* quote */}
                        <div
                          className="quote-message
                        text-xl text-purple p-2 mt-2 font-semibold  italic
                        "
                        >
                          For no limit set, leave the field empty.
                        </div>
                      </div>

                      <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="limit"
                            className="text-xl font-semibold text-heading"
                          >
                            Maximum issues
                          </label>
                          <input
                            type="number"
                            name="limit"
                            id="limit"
                            value={values.limit || ""}
                            onChange={(e) =>
                              setValues({ ...values, limit: e.target.value })
                            }
                            placeholder={
                              !values.limit ? "No limit set" : values.limit
                            }
                            className="border border-gray-300 rounded-md px-4 py-4 w-full text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex lg:w-[7rem] justify-center rounded-md bg-red-600 px-5 py-4 text-xl font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3  sm:w-auto"
                      onClick={handleUpdateLimit}
                    >
                      {loading ? (
                        <AiOutlineLoading3Quarters
                          size={16}
                          className="animate-spin text-white "
                        />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-4 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setColLimit(null);
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

export default React.memo(ColumnLimitOverlay);
