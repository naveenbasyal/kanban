import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AllProjects from "./pages/projects/AllProjects";
import SingleProject from "./pages/projects/SingleProject";
import AllBoards from "./pages/boards/AllBoards";
import SingleBoard from "./pages/boards/SingleBoard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllProjects,
  getAllUserProjects,
} from "./store/slices/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "./utils/getToken";

import ErrorPage from "./pages/ErrorPage";
import MyProfile from "./pages/user/MyProfile";
import { useUser } from "./Context/userContext";
import Feedback from "./pages/Feedback";
import AllFeedbacks from "./pages/AllFeedbacks";
import PreLoader from "./components/ui/PreLoader";
import People from "./pages/user/People";
import VerifyEmail from "./pages/auth/VerifyEmail";
export const badgeColors = {
  gray: { bg: "bg-gray-50", text: "text-gray-600", ring: "ring-gray-500/10" },
  red: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-600/10" },
  yellow: {
    bg: "bg-[#ffffeb]",
    text: "text-[#FFB200]",
    ring: "ring-yellow-600/20",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-600/20",
  },
  blue: {
    bg: "bg-[#ebf1ff]",
    text: "text-[#0047FF]",
    ring: "ring-blue-700/10",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-700/10",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-700/10",
  },
  pink: { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-700/10" },
};

const App = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const { user } = useUser();
  const { allProjects: globalProjects, projects: userProjects } = useSelector(
    (state) => state.projects
  );
  const [profile, setProfile] = useState({});

  const [openProfile, setOpenProfile] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  const [allBoards, setAllBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState([]);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      const getData = async () => {
        // ____________ Global Projects _______________
        const globalProjects = await dispatch(getAllProjects());

        // ____________ My Personal Projects _______________
        const myprojects = await dispatch(getAllUserProjects());

        // ____________ Shared Projects with me _______________
        const sharedProject = globalProjects?.payload.filter((project) => {
          if (project?.team?.find((member) => member?._id === user?._id)) {
            return { ...project };
          }
        });

        const mergedProjects = [...myprojects?.payload, ...sharedProject];

        setAllProjects(mergedProjects);
      };
      getData();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user?._id) {
      const globalData = [...globalProjects];

      const userData = globalData?.filter(
        (project) => project?.userId?._id === user?._id
      );

      const sharedProject = globalData?.filter((project) => {
        if (project?.team?.find((member) => member?._id === user?._id)) {
          return { ...project };
        }
      });

      const mergedProjects = [...userData, ...sharedProject];

      setAllProjects(mergedProjects);
    }
  }, [globalProjects]);

  useEffect(() => {
    const allBoardsFlat = allProjects?.map((project) => project?.boards).flat();
    setAllBoards(allBoardsFlat);
  }, [allProjects]);

  return (
    <div className="flex h-screen">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        className="z-50 text-2xl"
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isAuthenticated && !user?._id && <PreLoader />}
      {isAuthenticated && (
        <Sidebar
          allBoards={allBoards}
          setAllBoards={setAllBoards}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
        />
      )}
      <div className="flex flex-col flex-1 bg-white dark:bg-slate-900">
        {isAuthenticated && (
          <Navbar openProfile={openProfile} setOpenProfile={setOpenProfile} />
        )}
        {openProfile ? (
          <MyProfile
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
          />
        ) : null}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            {isAuthenticated ? (
              <>
                <Route
                  path="/"
                  element={
                    <AllProjects
                      allProjects={allProjects}
                      setAllProjects={setAllProjects}
                    />
                  }
                />
                <Route
                  path="/projects/:projectId"
                  element={<SingleProject setAllProjects={setAllProjects} />}
                />
                <Route path="/boards" element={<AllBoards />} />

                <Route
                  path="/projects/:projectId/board/:boardId"
                  element={<SingleBoard />}
                />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/people" element={<People />} />
                {isAdmin && (
                  <Route path="/all-feedbacks" element={<AllFeedbacks />} />
                )}
              </>
            ) : (
              <Route path="*" element={<ErrorPage />} />
            )}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:id/:token" element={<VerifyEmail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
