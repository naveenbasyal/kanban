import React, { useEffect, useState } from "react";
import InputText from "./form/InputText";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { Notification, SearchIcon } from "./svg";
import { useUser } from "../Context/userContext";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { logoutProjects } from "../store/slices/projectSlice";
import { logoutUser } from "../store/slices/userSlice";

const Navbar = ({ openProfile, setOpenProfile }) => {
  const { user } = useUser();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const handleTheme = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutProjects());
    dispatch(logoutUser());

    navigate("/login");
  };
  return (
    <div className="navbar sticky bg-white rounded-md dark:bg-slate-900 top-0 px-10 flex w-full h-[7rem] shadow-md shadow-[#ebf1ff] dark:shadow-slate-700 dark:shadow-sm">
      <div className="left-group flex gap-10 items-center w-2/4">
        <div className="project-name text-heading dark:text-slate-300 lg:text-3xl md:text-xl font-[600]">
          Hola Amigo
        </div>

        <div className="search-bar ">
          <InputText
            placeholder="Find something here..."
            icon={<SearchIcon />}
            py="py-3"
            pl="pl-14"
            pr="pr-20"
            width="w-[40rem]"
          />
        </div>
      </div>
      <div className="right-group flex justify-end gap-10 w-2/4">
        <div className="extras flex gap-10 items-center">
          <label
            className={`swap swap-rotate
           p-3 rounded-full
            ${theme === "light" ? "bg-indigo-50 " : "bg-slate-800 "}
            `}
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="opacity-0"
              onChange={handleTheme}
              checked={theme === "dark"}
            />

            <svg
              className={`swap-on fill-slate-200 w-10 h-10`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            <svg
              className="swap-off fill-indigo-400 dark:fill-slate-300 w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          <span className="cursor-pointer">
            <Notification />
          </span>
        </div>
        <div className="user">
          <div className="flex gap-10">
            <div
              onClick={() => setOpenProfile(!openProfile)}
              className="inline-flex cursor-pointer w-full justify-center items-center gap-8
               rounded-lg px-4 py-2 text-xl font-semibold  transition-colors duration-200
                hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <div className="user-avatar flex items-center">
                <LazyLoadImage
                  alt="userimage"
                  width={30}
                  effect="blur"
                  height={30}
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                  src={
                    user?.profilePicture ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${
                      user?.username?.toLowerCase()?.split(" ")[0]
                    }`
                  }
                />
              </div>
              <div className="user-name text-heading dark:text-slate-300 text-lg font-[500]">
                <span className="text-xl">{user?.username}</span>
                <p className="light:text-faded font-normal">{user?.email}</p>
              </div>
            </div>
            {/* _________ Logout button ___________ */}
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex text-xl h-fit items-center gap-2 px-3 py-4 text-white rounded-lg bg-red-600 hover:bg-red-500"
              >
                <IoMdLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
