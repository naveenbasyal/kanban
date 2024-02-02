import React, { useState } from "react";
import InputText from "./form/InputText";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { ArrowIcon, Notification, SearchIcon } from "./svg";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // console.log("Navbar Changed");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="navbar sticky top-0 px-10 flex w-full h-[7rem] shadow-md shadow-[#ebf1ff]">
      <div className="left-group flex gap-10 items-center w-2/4">
        <div className="project-name text-heading lg:text-3xl md:text-xl font-[600]">
          Class of 2022
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
          <div className="relative inline-block text-left">
            <div
              onClick={toggleDropdown}
              type="button"
              className="inline-flex cursor-pointer w-full justify-center items-center gap-5 rounded-md px-3 py-2 text-xl font-semibold   hover:bg-gray-50"
              id="menu-button"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="user-avatar flex items-center">
                <LazyLoadImage
                  alt="userimage"
                  width={30}
                  height={30}
                  className="rounded-full border-2 border-purple-dark"
                  src={`https://joesch.moe/api/v1/male/random?key=${new Date()
                    .getTime()
                    .toString()}`}
                />
              </div>
              <div className="user-name text-heading text-lg font-[500]">
                <span className="text-xl">Naveen Basyal</span>
                <p className="text-faded font-normal">
                  naveenbasyal.001@gmail.com
                </p>
              </div>
              <ArrowIcon />
            </div>

            <div
              className={`absolute right-0  z-10 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-md shadow-[#ebf1ff] ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-400 ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 hidden translate-y-[-8px]"
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
            >
              <div className="py-1" role="none">
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-gray-700 block px-5 py-2 text-2xl hover:bg-gray-100 hover:text-indigo-600"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-0"
                >
                  Edit
                </Link>
              </div>
              <div className="py-1" role="none">
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-gray-700 block px-5 py-2 text-2xl hover:bg-gray-100 hover:text-indigo-600"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-2"
                >
                  Archive
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-gray-700 block px-5 py-2 text-2xl hover:bg-gray-100 hover:text-indigo-600"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-3"
                >
                  Move
                </Link>
              </div>
              <div className="py-1" role="none">
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-gray-700 block px-5 py-2 text-2xl hover:bg-gray-100 hover:text-indigo-600"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-4"
                >
                  Share
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-gray-700 block px-5 py-2 text-2xl hover:bg-gray-100 hover:text-indigo-600"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-5"
                >
                  Add to favorites
                </Link>
              </div>
              <div className="py-1" role="none">
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-gray-700 block px-5 py-2 text-2xl hover:bg-gray-100 hover:text-indigo-600"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-6"
                >
                  Delete
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
