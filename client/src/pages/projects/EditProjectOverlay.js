import React, { useEffect } from "react";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Dialog, Transition } from "@headlessui/react";

import {
  UpdateProjectBasic,
  getAllProjects,
} from "../../store/slices/projectSlice";
import { FaRotate } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { getAllUsers } from "../../store/slices/userSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";

const EditProjectOverlay = ({
  setEditProject,
  editProject: { _id, title, description, team },
  setProject,
  project,
  setAllProjects,
}) => {
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);

  const { editLoading } = useSelector((state) => state.projects);
  const { allusers } = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersFound, setUsersFound] = useState([]);
  const [values, setValues] = useState({
    title: title,
    description: description,
    team: team,
  });

  useEffect(() => {
    setValues({ title, description, team });
  }, [title, description]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  useEffect(() => {
    setAllUsers(allusers);
  }, [allusers]);

  useEffect(() => {
    const users = allUsers?.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUsersFound(users);
  }, [searchQuery]);

  const handleUpdateProject = async () => {
    const newTeam = Array.from(values.team.map((p) => p._id));

    const data = await dispatch(
      UpdateProjectBasic({
        projectId: _id,
        title: values.title,
        description: values.description,
        team: newTeam,
      })
    );
    if (data?.payload) {
      setProject({
        ...project,
        title: data?.payload?.project?.title,
        description: data?.payload?.project?.description,
        team: values.team,
      });
      const data1 = await dispatch(getAllProjects());
      setAllProjects(data1?.payload);
      setEditProject(false);
      setValues({ title: "", description: "" });
    }
  };

  const handleDeletePerson = (person) => {
    const newTeam = values.team?.filter((p) => p._id !== person._id);
    setValues({ ...values, team: newTeam });
  };

  return (
    <>
      <Transition.Root show={_id !== null ? true : false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setEditProject}
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
                    Edit Project
                  </h3>
                  <div className="flex flex-col gap-10">
                    {/* _________Project Name __________ */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="project-name"
                        className="text-xl font-semibold text-heading"
                      >
                        Project name
                      </label>
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        value={values.title}
                        onChange={(e) =>
                          setValues({ ...values, title: e.target.value })
                        }
                        placeholder="Project name"
                        className="border border-gray-300 rounded-md px-4 py-2 text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>
                    {/* ________ Project Decription ________ */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="project-description"
                        className="text-xl font-semibold text-heading"
                      >
                        Project description
                      </label>
                      <textarea
                        rows={3}
                        value={values.description}
                        onChange={(e) =>
                          setValues({ ...values, description: e.target.value })
                        }
                        placeholder={
                          "Write a short description about your project"
                        }
                        name="project-description"
                        id="project-description"
                        className="border border-gray-300 rounded-md px-4 py-2 text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>
                    {/*  _________ Project Team _________ */}

                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-4 relative">
                        <label
                          htmlFor="label"
                          className="text-xl  font-semibold text-heading"
                        >
                          Team
                        </label>
                        {/* input to seach for all users */}
                        <input
                          type="text"
                          name="label"
                          id="label"
                          autoComplete="off"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Add team members"
                          className="border border-gray-300 rounded-md p-4 text-xl font-normal text-heading focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent"
                        />
                        {/* list of all users */}
                        {searchQuery && (
                          <div className="absolute right-0 top-14 border-2 overflow-y-hidden border-gray-200 p-2 rounded-lg max-h-40 w-3/5 bg-white">
                            <span className="absolute right-2 top-2 cursor-pointer bg-gray-100 p-2 rounded-full">
                              <IoClose
                                size={16}
                                onClick={() => setSearchQuery("")}
                              />
                            </span>
                            <ul className="overflow-y-auto max-h-40 pb-8">
                              {usersFound.length > 0 ? (
                                usersFound.map((user, index) => {
                                  return (
                                    <li
                                      key={index}
                                      className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        if (
                                          values.team.find(
                                            (person) => person._id === user._id
                                          )
                                        ) {
                                          toast.error(
                                            "User already added to the team"
                                          );
                                          return;
                                        }
                                        setValues({
                                          ...values,
                                          team: [...values.team, user],
                                        });
                                        setSearchQuery("");
                                      }}
                                    >
                                      <LazyLoadImage
                                        src={user?.profilePicture}
                                        alt="user-avatar"
                                        className="w-10 h-10 rounded-full"
                                        effect="blur"
                                      />
                                      <span className="text-lg text-heading">
                                        {user?.username}
                                      </span>
                                    </li>
                                  );
                                })
                              ) : (
                                <li
                                  key="no user"
                                  className="text-xl p-3 text-gray-500"
                                >
                                  No users Found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 flex-wrap mt-4">
                        {values?.team?.length > 0 ? (
                          values.team?.map((person, index) => {
                            return (
                              <div
                                key={index}
                                className="text-lg w-fit font-[500] flex gap-5 items-center bg-gray-100 p-3 rounded-md"
                              >
                                <span className="text-purple">
                                  {person?.username}
                                </span>
                                <span
                                  className="cursor-pointer"
                                  onClick={() => handleDeletePerson(person)}
                                >
                                  <IoClose size={14} />
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xl my-2 ml-3 text-gray-500">
                            No team members Found
                          </p>
                        )}
                      </div>
                      {values?.labels?.length === 0 && (
                        <p className="text-xl mt-5 ml-3 text-gray-500">
                          No labels Found
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      disabled={editLoading}
                      className={`w-32 inline-flex  justify-center rounded-md ${
                        editLoading ? "bg-gray-300" : "bg-red-600 "
                      } px-5 py-4 text-xl font-semibold text-white shadow-sm  sm:ml-3 `}
                      onClick={handleUpdateProject}
                    >
                      {editLoading ? (
                        <FaRotate className="animate-spin" size={16} />
                      ) : (
                        "Update"
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-4 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setEditProject(null);
                        setValues({ title: "", description: "" });
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

export default React.memo(EditProjectOverlay);
