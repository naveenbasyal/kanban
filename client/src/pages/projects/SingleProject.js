import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import LoadingScreen from "../../components/ui/LoadingScreen";
import AllBoards from "../boards/AllBoards";
import createBoard from "../../assets/createBoard.png";
import CreateBoard from "../boards/CreateBoard";

const SingleProject = () => {
  const id = useParams()?.projectId;

  const { projects, loading } = useSelector((state) => state?.projects);
  const [project, setProject] = useState([]);
  const [toggleCreateBoard, setToggleCreateBoard] = useState(false);

  useEffect(() => {
    const SingleProject = projects?.filter((project) => project._id === id);
    SingleProject && setProject(...SingleProject);
  }, [projects]);

  return (
    <>
      {project && (
        <div className="single-project m-10">
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
                <div
                  title="Edit project name"
                  className="edit-title ml-10 transition-all duration-200 hover:shadow-lg active:translate-y-[1.4px] cursor-pointer hover:text-indigo-500 "
                >
                  <FaRegEdit size={20} />
                </div>
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
                    <div className="member flex flex-col items-center gap-2">
                      <LazyLoadImage
                        effect="blur"
                        src={member.profilePicture}
                        alt={member.username}
                        width={30}
                        height={30}
                        className="object-cover rounded-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="no-team">
                    <div className="text-heading text-xl ">No team members</div>
                  </div>
                )}
                <div className="add-member">
                  <div className="cursor-pointer active:bg-indigo-100 transition-all duration-200  active:translate-y-[1px]  text-heading text-xl font-normal rounded-full p-2 bg-indigo-200">
                    <FaPlus size={15} className="text-blue-500" />
                  </div>
                </div>
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

            {project?.boards ? (
              <AllBoards
                boards={project?.boards}
                setProject={setProject}
                project={project}
              />
            ) : null}

            {/* ________ Create Board Overlay ______ */}
            {toggleCreateBoard ? (
              <CreateBoard
                toggleCreateBoard={toggleCreateBoard}
                setToggleCreateBoard={setToggleCreateBoard}
                project={project}
                setProject={setProject}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProject;
