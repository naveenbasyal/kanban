import React, { useCallback, useEffect } from "react";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CreateNewBoard } from "../../../store/slices/boardSlice";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getAllProjects } from "../../../store/slices/projectSlice";
import { CreateNewColumn } from "../../../store/slices/columnSlice";
import { FaCross } from "react-icons/fa";
import {
  updateTaskById,
  updateTaskText,
} from "../../../store/slices/TaskSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

const EditTaskOverlay = ({
  TaskToEdit: { text, _id, labels, flagged },
  setTaskToEdit,
  board,
  setBoard,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const { loading } = useSelector((state) => state.task);
  const [values, setValues] = useState({});
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    dispatch(getAllProjects());
    setValues({ text, labels, flagged });
  }, [text, labels, flagged]);
  const handleUpdateTask = async () => {
    console.log(values);
    if (values.text.trim().length === 0)
      return toast.error("Task name is required");
    const data = await dispatch(
      updateTaskById({
        taskId: _id,
        text: values?.text,
        labels: values.labels,
        flagged: values?.flagged,
      })
    );
    console.log(data);
    if (data.payload) {
      setBoard({
        ...board,
        columns: board.columns.map((column) => {
          return {
            ...column,
            tasks: column.tasks.map((task) => {
              if (task._id === _id) {
                return { ...task, text: values.text, labels: values.labels };
              }
              return task;
            }),
          };
        }),
      });
      setOpen(false);
      setValues({ text: "", labels: [], flagged: false });
      setTaskToEdit({});

      dispatch(getAllProjects());
      console.log("udpated client", data.payload);
    }
  };

  const handleAddLabel = (e) => {
    e.preventDefault();

    if (newLabel) {
      const isExist = values.labels.find(
        (label) => label.toLowerCase() === newLabel.toLowerCase()
      );
      if (isExist) return toast.error("Label already exist");
      setValues({ ...values, labels: [...values.labels, newLabel] });
      setNewLabel("");
    }
  };
  const handleDeleteLabel = (label) => {
    const newLabels = values.labels.filter((l) => l !== label);
    setValues({ ...values, labels: newLabels });
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
                          Edit Task
                        </Dialog.Title>
                      </div>

                      <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="text"
                            className="text-xl font-semibold text-heading"
                          >
                            Task Name
                          </label>
                          <input
                            type="text"
                            name="text"
                            id="text"
                            value={values.text}
                            onChange={(e) =>
                              setValues({ ...values, text: e.target.value })
                            }
                            placeholder="Task name"
                            className="border border-gray-300 rounded-md px-4 py-4 w-full text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                          />
                        </div>
                        {/* ____ labels _____ */}
                        <div className="flex flex-col gap-2">
                          <form onSubmit={handleAddLabel}>
                            <label
                              htmlFor="label"
                              className="text-xl  font-semibold text-heading"
                            >
                              Labels
                            </label>
                            <div className="flex gap-0 mt-3">
                              <input
                                type="text"
                                name="label"
                                id="label"
                                value={newLabel}
                                onChange={(e) => {
                                  setNewLabel(e.target.value);
                                }}
                                placeholder="Add labels"
                                className="border border-gray-300 rounded-md px-4 py-4 w-full text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                              />
                              <button
                                type="submit"
                                className="
                              bg-indigo-600 text-white px-4 py-2 rounded-md text-xl font-semibold hover:bg-indigo-500"
                              >
                                Add
                              </button>
                            </div>
                          </form>
                          <div className="flex gap-4 flex-wrap mt-4">
                            {values.labels?.map((label, index) => {
                              return (
                                <div
                                  key={index}
                                  className="text-lg w-fit font-[500] flex gap-5 items-center bg-gray-100 p-3 rounded-md"
                                >
                                  <span className="text-purple">{label}</span>
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => handleDeleteLabel(label)}
                                  >
                                    <IoClose size={14} />
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          {values?.labels?.length === 0 && (
                            <p className="text-xl mt-5 ml-3 text-gray-500">
                              No labels Found
                            </p>
                          )}
                        </div>
                        {/*______ Flagged Slider _____*/}
                        <div className=" flex gap-10">
                          <label
                            htmlFor="hs-basic-usage"
                            className="text-xl font-semibold"
                          >
                            Flagged
                          </label>
                          <input
                            type="checkbox"
                            id="hs-basic-usage"
                            name="hs-basic-usage"
                            checked={values.flagged}
                            onChange={(e) => {
                              console.log(e.target.checked, "flagged");
                              setValues({
                                ...values,
                                flagged: e.target.checked,
                              });
                            }}
                            className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600  dark:checked:bg-blue-500 dark:checked:border-blue-500  before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex lg:w-[7rem] justify-center rounded-md bg-red-600 px-5 py-4 text-xl font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3  sm:w-auto"
                      onClick={handleUpdateTask}
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
                        setOpen(false);
                        setTaskToEdit({});
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

export default React.memo(EditTaskOverlay);
