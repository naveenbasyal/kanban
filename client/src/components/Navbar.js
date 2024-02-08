import React from "react";
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

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutProjects());
    dispatch(logoutUser());

    navigate("/login");
  };
  return (
    <div className="navbar sticky top-0 px-10 flex w-full h-[7rem] shadow-md shadow-[#ebf1ff]">
      <div className="left-group flex gap-10 items-center w-2/4">
        <div className="project-name text-heading lg:text-3xl md:text-xl font-[600]">
          Hola Amigo
        </div>
        <div className="search-bar">
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
        <div className="notification">
          <span className="cursor-pointer">
            <Notification />
          </span>
        </div>
        <div className="user">
          <div className="flex gap-10">
            <div
              onClick={() => setOpenProfile(!openProfile)}
              className="inline-flex cursor-pointer w-full justify-center items-center gap-8 rounded-md px-3 py-2 text-xl font-semibold  transition-colors duration-200 hover:bg-gray-100"
            >
              <div className="user-avatar flex items-center">
                <LazyLoadImage
                  alt="userimage"
                  width={30}
                  effect="blur"
                  height={30}
                  className="rounded-full  border-purple-dark"
                  src={
                    user?.profilePicture ||
                    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1725655669.jpg"
                  }
                />
              </div>
              <div className="user-name text-heading text-lg font-[500]">
                <span className="text-xl">{user?.username}</span>
                <p className="text-faded font-normal">{user?.email}</p>
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
