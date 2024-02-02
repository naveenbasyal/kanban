import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AllProjects from "./pages/projects/AllProjects";
import SingleProject from "./pages/projects/SingleProject";
import AllBoards from "./pages/boards/AllBoards";
import SingleBoard from "./pages/boards/SingleBoard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllProjects } from "./store/slices/projectSlice";
import { useDispatch } from "react-redux";

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

  const [allProjects, setAllProjects] = useState([]);
  // console.log("App Changed");

  useEffect(() => {
    const getData = async () => {
      const data = await dispatch(getAllProjects());

      data.payload && setAllProjects(data.payload);
    };
    getData();
  }, []);

  return (
    <Router>
      <div className="flex h-screen">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          className="z-50 text-2xl"
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <AllProjects
                    allProjects={allProjects}
                    setAllProjects={setAllProjects}
                  />
                }
              />
              <Route path="/projects/:projectId" element={<SingleProject />} />
              <Route path="/boards" element={<AllBoards />} />
              <Route
                path="/projects/:projectId/board/:boardId"
                element={<SingleBoard />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
