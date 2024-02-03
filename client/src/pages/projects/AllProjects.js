import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// UI elements
import Button from "../../components/ui/Button";
import {
  NotFound,
  PlusIcon,
  SearchIcon,
  ThreeDots,
} from "../../components/svg";
import SelectOptions from "../../components/form/SelectOptions";
import { toast } from "react-toastify";
// Overlays
import DeleteProjectOverlay from "../../components/overlays/DeleteProjectOverlay";
import CreateProject from "./CreateProject";
// Slices
import {
  deleteSingleProject,
  getAllProjects,
} from "../../store/slices/projectSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";

//  Icons
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegCopy, FaRegEdit } from "react-icons/fa";
import { HiCursorArrowRipple } from "react-icons/hi2";
import LoadingScreen from "../../components/ui/LoadingScreen";

const AllProjects = ({ allProjects, setAllProjects }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.projects);

  // ------ states for more info dropdown  --------
  const [isOpen, setIsOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [createProject, setCreateProject] = useState(false);
  // ------ states for delete project overlay  --------
  const [deleteProject, setDeleteProject] = useState(null);

  const filters = ["All projects", "My projects", "Shared with me", "Archived"];

  const deleteProjectById = async () => {
    const data = await dispatch(deleteSingleProject(deleteProject?._id));

    if (data?.payload) {
      toast.success(data.payload.message);
      const filteredProjects = allProjects.filter(
        (project) => project._id != deleteProject._id
      );
      setAllProjects(filteredProjects);
      setDeleteProject(null);
    }
  };

  return (
    <div className="all-projects h-full p-10">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="text-heading  text-4xl font-[700] ">Projects</div>
            <div className="create-project">
              <Button
                setCreateProject={setCreateProject}
                color="text-white"
                bg="bg-dark-color"
                title="Create project"
                width="w-auto"
                icon={<PlusIcon color="white" />}
              />
            </div>
          </div>
          <div className="search-filters w-full my-10">
            <div className="flex gap-10">
              <div className="relative flex items-center w-1/4">
                <input
                  id="5"
                  type="text"
                  placeholder="Search projects"
                  className="peer outine-none relative h-10 w-full rounded-md pl-4 py-7 pr-10 font-normal text-xl border-2 border-gray-light focus:outline-dashed drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-[#7c91f1] focus:drop-shadow-lg"
                />
                <span className="absolute right-2 transition-all duration-200 ease-in-out ">
                  <SearchIcon />
                </span>
              </div>
              <SelectOptions items={filters} />
            </div>
          </div>

          {/*  ----------- All projects List ----------- */}
          {allProjects?.length === 0 ? (
            <div className="flex flex-col mt-[8rem] items-center justify-center gap-5 text-2xl text-gray-400">
              <NotFound width={140} />
              <div>Start creating projects to see them here.</div>
            </div>
          ) : (
            <div className="projects-list">
              <div>
                <table className="table text-xl ">
                  <thead>
                    <tr className="text-xl">
                      <th>Name</th>
                      <th>Description</th>
                      <th>Lead</th>
                      <th>Team</th>
                      <th className="flex justify-center ">More Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {!allProjects?.message &&
                      allProjects?.map((item) => {
                        return (
                          <tr className="hover:bg-gray-100" key={item?._id}>
                            <td>
                              <Link
                                to={`/projects/${item?._id}`}
                                className="text-blue-500 flex items-center gap-5"
                              >
                                <LazyLoadImage
                                  alt="project logo"
                                  width={30}
                                  height={30}
                                  effect="blur"
                                  className="rounded-box border"
                                  src={item?.logo}
                                />
                                {item?.title}
                              </Link>
                            </td>
                            <td
                              className={`
                            ${
                              item?.description
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                            >
                              {item?.description
                                ? item?.description
                                : "No description"}
                            </td>
                            <td>
                              <Link
                                to={`/user/${item?.userId?._id}`}
                                className="flex items-center gap-4 text-blue-500"
                              >
                                <LazyLoadImage
                                  effect="blur"
                                  alt="project logo"
                                  width={20}
                                  height={20}
                                  className="rounded-box border"
                                  src={item?.userId?.profilePicture}
                                />{" "}
                                {item?.userId?.username}
                              </Link>
                            </td>
                            <td>
                              <div className="flex -space-x-1 overflow-hidden">
                                {item?.team?.map((member, id) => (
                                  <LazyLoadImage
                                    key={id}
                                    alt="member"
                                    effect="blur"
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                    src={member?.profilePicture}
                                  />
                                ))}
                                {!item?.team?.length && (
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                                    <span className="text-gray-400 text-xl font-semibold">
                                      {item?.team?.length}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            {/*------------- More Info ------------ */}
                            <td className="flex justify-center cursor-pointer">
                              <div className="relative inline-block text-left">
                                <div>
                                  <button
                                    onClick={() => {
                                      setIsOpen(!isOpen);
                                      setOpenId(item._id);
                                    }}
                                    type="button"
                                    className={`inline-flex ${
                                      isOpen && openId == item._id
                                        ? " bg-indigo-100"
                                        : "bg-transparent text-gray-900 outline-none  "
                                    } border-none w-full justify-center gap-x-1.5 h-8 items-center rounded-md  px-3 py-2 text-sm font-semibold   hover:bg-gray-50`}
                                    id="menu-button"
                                    aria-expanded="true"
                                    aria-haspopup="true"
                                  >
                                    <ThreeDots
                                      color={
                                        isOpen && openId == item._id
                                          ? "indigo"
                                          : "gray"
                                      }
                                    />
                                  </button>
                                </div>

                                <div
                                  className={`absolute ${
                                    isOpen && openId == item._id
                                      ? "block"
                                      : "hidden"
                                  } right-0 z-10 mt-2 w-56 py-4
                          transition-all duration-200 ease-in-out
                           origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                  role="menu"
                                  aria-orientation="vertical"
                                  aria-labelledby="menu-button"
                                  tabIndex="-1"
                                >
                                  <div
                                    className="py-3 flex flex-col gap-2"
                                    role="none"
                                  >
                                    <Link
                                      to={`/projects/${item?._id}`}
                                      className="flex items-center gap-3 hover:text-indigo-500 text-gray-700  px-4 py-2 text-xl hover:bg-gray-100"
                                      role="menuitem"
                                      tabIndex="-1"
                                      id="menu-item-1"
                                    >
                                      <HiCursorArrowRipple size={16} /> Open
                                      project
                                    </Link>
                                    <span
                                      onClick={() => {
                                        setDeleteProject(item);
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
                                        navigator.clipboard.writeText(item._id);
                                        toast.info(
                                          `Project id copied to clipboard`
                                        );
                                        setIsOpen(false);
                                      }}
                                      className="flex gap-3 hover:text-indigo-500 text-gray-700  items-center px-4 py-2 text-xl hover:bg-gray-100"
                                      role="menuitem"
                                      tabIndex="-1"
                                      id="menu-item-0"
                                    >
                                      <FaRegCopy size={16} /> Copy project id
                                    </span>
                                    <span
                                      onClick={() => {
                                        setDeleteProject(item);
                                        setIsOpen(false);
                                      }}
                                      className="text-red-500 flex items-center gap-3 px-4 py-2 text-xl hover:bg-gray-100"
                                      role="menuitem"
                                      tabIndex="-1"
                                      id="menu-item-0"
                                    >
                                      <AiOutlineDelete size={16} />
                                      Delete project
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {createProject ? (
            <CreateProject
              allProjects={allProjects}
              setAllProjects={setAllProjects}
              createProject={createProject}
              setCreateProject={setCreateProject}
            />
          ) : null}
          {deleteProject ? (
            <DeleteProjectOverlay
              deleteProjectById={deleteProjectById}
              deleteProject={deleteProject}
              setDeleteProject={setDeleteProject}
              title="Delete project"
              info="Are you sure you want to delete this project? All of your data will be permanently removed. This action cannot be undone."
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default AllProjects;
