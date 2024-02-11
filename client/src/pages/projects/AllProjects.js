import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import DeleteProjectOverlay from "./DeleteProjectOverlay";
import CreateProject from "./CreateProject";
// Slices
import {
  deleteSingleProject,
  getAllProjects,
  getAllUserProjects,
  handleStarredProject,
} from "../../store/slices/projectSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";

//  Icons
import { AiOutlineDelete, AiOutlineLoading } from "react-icons/ai";
import {
  FaExclamationTriangle,
  FaRegCopy,
  FaRegEdit,
  FaShare,
} from "react-icons/fa";
import { HiCursorArrowRipple } from "react-icons/hi2";
import LoadingScreen from "../../components/ui/LoadingScreen";
import EditProjectOverlay from "./EditProjectOverlay";
import { useUser } from "../../Context/userContext";

// __________ Socket io ___________
import io from "socket.io-client";

const socket = io(`${process.env.REACT_APP_SERVER_URL}`, {
  transports: ["websocket"],
});

const AllProjects = ({ allProjects, setAllProjects }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  // my profile
  const { user } = useUser();

  const { loading } = useSelector((state) => state?.projects);

  // Searching projects
  const [query, setQuery] = useState("");

  // _______ States for more info dropdown  _________
  const [isOpen, setIsOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [createProject, setCreateProject] = useState(false);

  // ________ Edit  project overlay  _________
  const [editProject, setEditProject] = useState(null);

  // __________ Delete project overlay  ___________
  const [deleteProject, setDeleteProject] = useState(null);

  // _______ Filters for projects  _______
  const [projects, setProjects] = useState([]);
  const filters = ["All projects", "Starred", "Shared with me", "Archived"];
  const [selectedFilter, setSelectedFilter] = useState(
    localStorage.getItem("selectedFilter") || filters[0]
  );

  // _______ Searching projects _________
  useEffect(() => {
    if (query) {
      const searchedProject = allProjects?.filter((project) =>
        project?.title?.toLowerCase().includes(query?.toLowerCase())
      );
      setProjects(searchedProject);
    } else {
      setProjects(allProjects);
    }
  }, [query]);

  //  ________ Sorting projects based on filters  ________
  useEffect(() => {
    if (selectedFilter === "All projects") {
      setProjects(allProjects);
    } else if (selectedFilter === "Starred") {
      const starredFirst = [...allProjects].filter(
        (project) => project?.starred
      );
      setProjects(starredFirst);
    } else if (selectedFilter === "Shared with me") {
      const sharedWithMe = [...allProjects].filter(
        (project) => project?.userId?._id !== user._id
      );
      setProjects(sharedWithMe);
    } else {
      setProjects(allProjects);
    }
  }, [selectedFilter, allProjects]);

  // _________ Redirecting to login if not authenticated __________
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(getAllProjects());
      navigate("/");
    }
  }, [isAuthenticated]);

  // ___________ Close dropdown on outside click ___________
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id !== "menu-button") {
        isOpen && setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // ______________ Real time updates fro projects ______________
  useEffect(() => {
    socket.on("projectUpdated", (project) => {
      dispatch(getAllProjects());
      dispatch(getAllUserProjects());

      toast.info(`"${project?.title}" project is updated`);
    });
    socket.on("projectDeleted", (project) => {
      dispatch(getAllProjects());
      toast.info(`"${project?.title}" project is deleted`);
    });

    return () => {
      socket.off("projectUpdated");
      socket.off("projectDeleted");
    };
  }, []);

  // _______ Delete project by id  _______
  const deleteProjectById = async () => {
    const filteredProjects = allProjects.filter(
      (project) => project._id != deleteProject._id
    );
    setAllProjects(filteredProjects);
    setDeleteProject(null);
    const data = await dispatch(deleteSingleProject(deleteProject?._id));

    if (data?.payload?.project) {
      socket.emit("projectDeleted", data?.payload?.project);
      dispatch(getAllProjects());
    } else {
      toast.error(data?.payload?.message);
    }
  };

  const handleStarred = (projectId) => {
    const projects = allProjects;
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        return { ...project, starred: !project.starred };
      }
      return project;
    });
    setAllProjects(updatedProjects);
    dispatch(handleStarredProject({ projectId }));
  };

  return (
    <div className="all-projects h-full p-10 bg-white dark:bg-slate-900">
      <>
        <div className="flex justify-between items-center">
          <div className="text-heading dark:text-slate-300   text-4xl font-[700] ">
            Projects
          </div>
          <div className="create-project">
            <Button
              setCreateProject={setCreateProject}
              color="text-white"
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
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search projects"
                className="peer outine-none relative h-10 w-full rounded-md pl-4 py-7 pr-10
                  dark:bg-slate-800 dark:border-slate-700
                  font-normal text-xl border-1 border-gray-light focus:outline-dashed
                   drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white 
                   focus:ring-1 dark:focus:ring-slate-700 focus:ring-[#7c91f1] focus:drop-shadow-lg"
              />
              <span className="absolute right-2 transition-all duration-200 ease-in-out ">
                <SearchIcon />
              </span>
            </div>
            <SelectOptions
              items={filters}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          </div>
        </div>

        {loading ? (
          <div className="w-full my-4 text-slate-700 text-xl dark:text-slate-400">
            <div className="flex gap-4 items-center">
              Loading projects{" "}
              <AiOutlineLoading className="animate-spin-fast .4s" />
            </div>
          </div>
        ) : // {/*  ----------- All projects List ----------- */}
        allProjects?.length === 0 ? (
          <div className="flex flex-col mt-[8rem] items-center justify-center gap-5 text-2xl text-gray-400">
            <NotFound width={140} />
            <div>Start creating projects to see them here.</div>
          </div>
        ) : (
          <div className="projects-list">
            <div>
              <table className="table text-xl ">
                <thead>
                  <tr className="text-xl text-gray-500 dark:text-slate-300 border-b-gray-200 dark:border-b-slate-600">
                    <th></th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Lead</th>
                    <th>Team</th>
                    <th className="flex justify-center">More Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {!allProjects?.message &&
                    projects?.map((item, idx) => {
                      return (
                        <tr
                          className="hover:bg-gray-100 dark:hover:bg-slate-800 border-b-gray-200 dark:border-b-slate-600"
                          key={`${idx * item._id}-${item?._id}`}
                        >
                          <td>
                            {item?.userId?._id !== user._id ? (
                              <FaShare
                                title={`Shared by ${item?.userId?.username}`}
                                size={20}
                                className="text-gray-400 cursor-pointer"
                              />
                            ) : (
                              <span
                                className="cursor-pointer"
                                title="mark starred"
                                onClick={() => handleStarred(item._id)}
                              >
                                <svg
                                  height="16"
                                  width="17"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 47.94 47.94"
                                >
                                  <path
                                    className={`${
                                      item?.starred
                                        ? "fill-yellow-400"
                                        : "fill-white"
                                    }`}
                                    stroke="#000"
                                    d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956C22.602,0.567,25.338,0.567,26.285,2.486z"
                                  />
                                </svg>
                              </span>
                            )}
                          </td>
                          <td>
                            <Link
                              to={`/projects/${item?._id}`}
                              className="text-blue-500 flex items-center gap-5"
                            >
                              {item?.title}
                            </Link>
                          </td>
                          <td
                            title={item?.description}
                            className={`
                                w-2/5
                            ${
                              item?.description
                                ? "text-gray-600 dark:text-slate-400"
                                : "text-gray-400"
                            }`}
                          >
                            {item?.description?.length > 60
                              ? item?.description?.slice(0, 60) + "..."
                              : item?.description?.length > 0
                              ? item?.description
                              : "No description"}
                          </td>
                          {/* _________ Lead By __________ */}
                          <td>
                            <Link
                              className="flex items-center gap-4 text-blue-500"
                              title={`Lead by ${item?.userId?.email}`}
                            >
                              <LazyLoadImage
                                effect="blur"
                                alt="project logo"
                                width={20}
                                height={20}
                                className="rounded-full"
                                referrerPolicy="no-referrer"
                                src={item?.userId?.profilePicture}
                              />{" "}
                              {item?.userId?.username}
                            </Link>
                          </td>
                          {/* ____________ Team members ________- */}
                          <td>
                            <div className="flex -space-x-1 overflow-hidden">
                              {item.team.length === 0 && (
                                <span className="text-gray-400 text-xl">
                                  No team members
                                </span>
                              )}
                              {item?.team?.length > 3 ? (
                                <div className="flex items-center gap-2">
                                  {item?.team?.slice(0, 3).map((member, id) => (
                                    <LazyLoadImage
                                      title={`${member?.username} - ${member?.email}`}
                                      key={`${id}-${member._id}-${id}`}
                                      alt="member"
                                      effect="blur"
                                      className="inline-block cursor-pointer h-8 w-8 rounded-full "
                                      src={
                                        member?.profilePicture ||
                                        `https://api.dicebear.com/7.x/bottts/svg?seed=${
                                          member?.username
                                            ?.toLowerCase()
                                            ?.split(" ")[0]
                                        }`
                                      }
                                    />
                                  ))}
                                  <span
                                    title="View all team members"
                                    onClick={() => {
                                      navigate(`/projects/${item._id}`);
                                    }}
                                    className="text-red-400 text-xl cursor-pointer"
                                  >
                                    +{item.team.length - 3} more
                                  </span>
                                </div>
                              ) : (
                                item?.team?.length <= 3 &&
                                item?.team?.map((member, id) => (
                                  <LazyLoadImage
                                    title={
                                      member?._id === user?._id
                                        ? "You"
                                        : `${member?.username} - ${member?.email}`
                                    }
                                    key={`${id}-${member._id}-${
                                      id * member._id
                                    }`}
                                    alt="member"
                                    effect="blur"
                                    className="inline-block h-8 cursor-pointer w-8 rounded-full"
                                    src={member?.profilePicture}
                                  />
                                ))
                              )}
                            </div>
                          </td>
                          {/*------------- More Info ------------ */}
                          <td
                            className="flex justify-center cursor-pointer"
                            id="menu-button"
                          >
                            <div
                              id="menu-button"
                              className="relative inline-block text-left"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsOpen(!isOpen);
                                  setOpenId(item._id);
                                }}
                                type="button"
                                className={`inline-flex ${
                                  isOpen && openId == item._id
                                    ? " bg-indigo-100 dark:bg-slate-600"
                                    : "bg-transparent text-gray-900 dark:text-slate-300 outline-none  "
                                } border-none w-full justify-center gap-x-1.5 h-10 items-center rounded-md
                                    px-3 py-2 text-sm font-semibold   hover:bg-gray-50 dark:hover:bg-slate-600`}
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

                              <div
                                className={`absolute ${
                                  isOpen && openId == item._id
                                    ? "block"
                                    : "hidden"
                                } right-0 z-10 mt-2 w-56 py-4
                          transition-all duration-200 ease-in-out
                          dark:ring-1 dark:ring-slate-600  dark:bg-slate-800 
                           origin-top-right rounded-md bg-whiteshadow-lg ring-1
                            ring-black ring-opacity-5 focus:outline-none`}
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="menu-button"
                                tabIndex="-1"
                              >
                                <div
                                  aria-disabled="true"
                                  className="py-3 flex flex-col gap-2"
                                  role="none"
                                >
                                  <Link
                                    to={`/projects/${item?._id}`}
                                    className="flex items-center gap-3 hover:text-indigo-500 text-gray-700 
                                        px-4 py-2 text-xl hover:bg-gray-100 dark:text-slate-400 hover:dark:bg-slate-700"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-1"
                                  >
                                    <HiCursorArrowRipple size={16} /> Open
                                    project
                                  </Link>
                                  <button
                                    disabled={item?.userId?._id !== user._id}
                                    onClick={() => {
                                      setEditProject(item);
                                      setIsOpen(false);
                                    }}
                                    className={`flex gap-3 ${
                                      item?.userId?._id !== user._id
                                        ? "text-gray-300 cursor-not-allowed bg-gray-100 dark:bg-slate-700 dark:text-slate-500"
                                        : "hover:text-indigo-500 text-gray-700 hover:bg-gray-100 dark:text-slate-400 hover:dark:bg-slate-700"
                                    }   items-center px-4 py-2 text-xl `}
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0"
                                  >
                                    <FaRegEdit size={16} /> Edit
                                  </button>
                                  <span
                                    onClick={() => {
                                      navigator.clipboard.writeText(item._id);
                                      toast.info(
                                        `Project id copied to clipboard`
                                      );
                                      setIsOpen(false);
                                    }}
                                    className="flex gap-3 hover:text-indigo-500 text-gray-700  items-center px-4 py-2
                                       text-xl hover:bg-gray-100 dark:text-slate-400 hover:dark:bg-slate-700"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0"
                                  >
                                    <FaRegCopy size={16} /> Copy project id
                                  </span>
                                  <button
                                    onClick={() => {
                                      setDeleteProject(item);
                                      setIsOpen(false);
                                    }}
                                    disabled={item?.userId?._id !== user._id}
                                    className={`${
                                      item?.userId?._id !== user._id
                                        ? "text-gray-300 cursor-not-allowed bg-gray-100 dark:text-slate-500 dark:bg-slate-700"
                                        : " text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    } flex items-center gap-3 px-4 py-2 text-xl hover:bg-gray-100`}
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-0"
                                  >
                                    <AiOutlineDelete size={16} />
                                    Delete project
                                  </button>
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
        {editProject ? (
          <EditProjectOverlay
            allProjects={allProjects}
            setAllProjects={setAllProjects}
            editProject={editProject}
            setEditProject={setEditProject}
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
    </div>
  );
};

export default AllProjects;
