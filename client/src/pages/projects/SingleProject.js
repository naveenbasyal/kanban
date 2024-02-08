import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import LoadingScreen from "../../components/ui/LoadingScreen";
import AllBoards from "../boards/AllBoards";
import createBoard from "../../assets/createBoard.png";
import CreateBoard from "../boards/CreateBoard";
import { NotFound } from "../../components/svg";
import EditProjectOverlay from "./EditProjectOverlay";
import { useUser } from "../../Context/userContext";
import {
  getAllProjects,
  getAllUserProjects,
} from "../../store/slices/projectSlice";
// __________ Socket io ___________
import io from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

const SingleProject = ({ setAllProjects }) => {
  const id = useParams()?.projectId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const { allProjects: projects, loading } = useSelector(
    (state) => state?.projects
  );
  const [project, setProject] = useState([]);
  const [toggleCreateBoard, setToggleCreateBoard] = useState(false);
  const [editProject, setEditProject] = useState(null);

  // Get the single project by id
  useEffect(() => {
    const SingleProject = projects?.filter((project) => project._id === id);
    SingleProject && setProject(...SingleProject);
  }, [projects]);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  useEffect(() => {
    socket.on("boardCreated", (board) => {
      dispatch(getAllProjects());
      toast.info(`"${board?.title}" board is created`);
    });
    socket.on("boardUpdated", (board) => {
      dispatch(getAllProjects());
      toast.info(`"${board?.title}" board is updated`);
    });
    socket.on("boardDeleted", (board) => {
      dispatch(getAllProjects());
      toast.info(`"${board?.title}" board is deleted`);
    });
    // __________ Project ___________

    socket.on("projectUpdated", (project) => {
      dispatch(getAllProjects());
      dispatch(getAllUserProjects());
      toast.info(`"${project?.title}" project is updated`);
    });

    socket.on("projectDeleted", (project) => {
      dispatch(getAllProjects());
      toast.info(`"${project?.title}" project is deleted`);
      navigate("/");
    });

    return () => {
      socket.off("projectUpdated");
      socket.off("projectDeleted");
      socket.off("boardCreated");
      socket.off("boardUpdated");
      socket.off("boardDeleted");
    };
  }, []);

  return (
    <>
      {project && (
        <div className="single-project px-13 pb-20 pt-10">
          {/* ---------- Project Information and all the Boards of the project ------- */}

          <div className="flex gap-5 ">
            <div className="project-logo pt-2">
              <LazyLoadImage
                effect="blur"
                src={project.logo}
                alt={project.title}
                width={30}
                height={30}
                className="object-cover rounded-full"
              />
            </div>
            <div className="name-edit flex flex-col gap-3">
              {/* -------- Name -------- */}
              <div className="flex items-center">
                <div className="text-heading lg:text-[2.5rem] font-bold">
                  {project.title}
                </div>
                <button
                  disabled={project?.userId?._id !== user?._id}
                  onClick={() => setEditProject(project)}
                  title={
                    project?.userId?._id !== user?._id
                      ? "Only project can edit this project"
                      : "Edit project name"
                  }
                  className={`${
                    project?.userId?._id !== user?._id
                      ? "cursor-not-allowed text-gray-300 p-2 "
                      : "hover:text-indigo-500 cursor-pointer text-heading"
                  } edit-title ml-10 rounded-full transition-all duration-200 hover:shadow-lg active:translate-y-[1.4px]  `}
                >
                  <FaRegEdit size={20} />
                </button>
              </div>
              {/* -------  Description -------- */}
              <div className="project-description capitalize text-xl">
                {project.description}
              </div>
            </div>
          </div>

          <div className="mx-16 ">
            {/* _______ Project TEAM __________ */}
            <div className="team flex items-center mt-10 mb-5 gap-5">
              <div className="text-xl text-heading font-bold ">Team :</div>
              <div className="team-members flex items-center gap-5">
                {project?.team?.length > 0 ? (
                  project?.team?.map((member) => (
                    <div
                      className="member relative flex flex-col items-center gap-2"
                      key={`${member._id}-${member.username}`}
                    >
                      <LazyLoadImage
                        effect="blur"
                        src={member.profilePicture}
                        alt={member.username}
                        width={30}
                        height={30}
                        title={member.username}
                        className="object-cover rounded-full cursor-pointer"
                      />
                      {member?._id === user?._id && (
                        <span className="absolute -bottom-8 font-semibold text-purple">
                          You
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-team">
                    <div className="text-heading text-xl">No team members</div>
                  </div>
                )}
                <button
                  disabled={project?.userId?._id !== user?._id}
                  title={
                    project?.userId?._id !== user?._id
                      ? "Only project owner can add members"
                      : "Add members to the project"
                  }
                  className={`${
                    project?.userId?._id !== user?._id
                      ? "cursor-not-allowed text-gray-300 bg-gray-100 "
                      : "hover:text-indigo-500 active:bg-indigo-100 cursor-pointer  bg-indigo-200"
                  } transition-all duration-200  active:translate-y-[1px]  text-heading text-xl font-normal rounded-full p-2`}
                  onClick={() => setEditProject(project)}
                >
                  <FaPlus size={15} className="" />
                </button>
              </div>
            </div>

            {/* ______ Filters for Board  _____ */}
            <div className="my-20">
              <div className="flex items-center w-full h-full justify-between">
                <div className="flex gap-5 text-[1.56rem] text-purple font-[500] items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M12 22.6667V9.33332M12 22.6667C12 23.3739 11.719 24.0522 11.219 24.5523C10.7189 25.0524 10.0406 25.3333 9.33333 25.3333H6.66667C5.95942 25.3333 5.28115 25.0524 4.78105 24.5523C4.28095 24.0522 4 23.3739 4 22.6667V9.33332C4 8.62608 4.28095 7.9478 4.78105 7.4477C5.28115 6.94761 5.95942 6.66666 6.66667 6.66666H9.33333C10.0406 6.66666 10.7189 6.94761 11.219 7.4477C11.719 7.9478 12 8.62608 12 9.33332M12 22.6667C12 23.3739 12.281 24.0522 12.781 24.5523C13.2811 25.0524 13.9594 25.3333 14.6667 25.3333H17.3333C18.0406 25.3333 18.7189 25.0524 19.219 24.5523C19.719 24.0522 20 23.3739 20 22.6667M12 9.33332C12 8.62608 12.281 7.9478 12.781 7.4477C13.2811 6.94761 13.9594 6.66666 14.6667 6.66666H17.3333C18.0406 6.66666 18.7189 6.94761 19.219 7.4477C19.719 7.9478 20 8.62608 20 9.33332M20 22.6667V9.33332M20 22.6667C20 23.3739 20.281 24.0522 20.781 24.5523C21.2811 25.0524 21.9594 25.3333 22.6667 25.3333H25.3333C26.0406 25.3333 26.7189 25.0524 27.219 24.5523C27.719 24.0522 28 23.3739 28 22.6667V9.33332C28 8.62608 27.719 7.9478 27.219 7.4477C26.7189 6.94761 26.0406 6.66666 25.3333 6.66666H22.6667C21.9594 6.66666 21.2811 6.94761 20.781 7.4477C20.281 7.9478 20 8.62608 20 9.33332"
                      stroke="#5A5B80"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>My Boards</span>
                </div>
                <div className="flex gap-20">
                  <div className="sort flex gap-2 text-xl text-purple font-[500] items-center">
                    Sort by (Default)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M17 20L21 16M3 4H16H3ZM3 8H12H3ZM3 12H12H3ZM17 8V20V8ZM17 20L13 16L17 20Z"
                        stroke="#5A5B80"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <button
                    onClick={() => {
                      setToggleCreateBoard(true);
                    }}
                    className="cursor-pointer outline-none bg-[#16174b] hover:bg-[#1c3062] transition-all duration-200  active:translate-y-[1.3px] hover:shadow-gray-light create-board rounded-md p-5 flex  justify-center items-center "
                  >
                    <p className="text-white text-xl font-semibold">
                      Create new board
                    </p>
                    <LazyLoadImage
                      effect="blur"
                      src={createBoard}
                      alt="board"
                      width={35}
                      style={{
                        transform: "rotate(180deg)",
                        transition: ".6s ease-in-out",
                      }}
                      className="object-cover rounded-lg "
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* ______ ALL BOARDS ____ */}

            {project?.boards?.length > 0 ? (
              <AllBoards
                boards={project?.boards}
                setProject={setProject}
                project={project}
              />
            ) : (
              <div className="flex flex-col mt-[8rem] items-center justify-center gap-5 text-2xl text-gray-400">
                <NotFound width={100} />
                <div>Start creating boards to see them here.</div>
              </div>
            )}

            {/* ________ Create Board Overlay ______ */}
            {toggleCreateBoard ? (
              <CreateBoard
                toggleCreateBoard={toggleCreateBoard}
                setToggleCreateBoard={setToggleCreateBoard}
                project={project}
                setProject={setProject}
              />
            ) : null}
            {editProject ? (
              <EditProjectOverlay
                project={project}
                setProject={setProject}
                editProject={editProject}
                setEditProject={setEditProject}
                setAllProjects={setAllProjects}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProject;
