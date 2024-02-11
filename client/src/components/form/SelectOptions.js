import React, { useEffect, useState } from "react";

const SelectOptions = ({ selectedFilter, setSelectedFilter, items }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="relative w-1/4">
        <button
          onClick={handleDropdown}
          type="button"
          className="relative  w-full cursor-pointer  rounded-md bg-white dark:bg-slate-800
           py-5 transition-all text-2xl  pl-3 pr-10 text-left text-heading dark:text-slate-300 
            shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-sm sm:leading-6"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          <span className="flex items-center">
            <span className="ml-3  text-xl text-purple dark:text-slate-300  font-semibold block truncate">
              {selectedFilter}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        <ul
          className={`absolute z-10 mt-1 max-h-56  w-full transition-transform ease-in duration-200
           overflow-auto rounded-md bg-white dark:bg-slate-800 py-1  shadow-lg ring-1 dark:ring-slate-700 ring-gray-300 
           focus:outline-none sm:text-sm 
          ${
            isDropdownOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 hidden translate-y-[-8px]"
          }
          `}
          tabIndex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          {items.map((item, index) => (
            <li
              key={index}
              className="text-gray-900  relative cursor-pointer select-none py-2 pl-3 pr-9
               hover:text-indigo-600 dark:text-slate-300  hover:font-semibold dark:hover:bg-slate-700 hover:bg-gray-100"
              id="listbox-option-0"
              role="option"
              onClick={() => {
                setSelectedFilter(item);
                localStorage.setItem("selectedFilter", item);
                setIsDropdownOpen(true && false);
              }}
            >
              <div className="flex items-center">
                <span
                  className={`${
                    selectedFilter == item ? "font-semibold" : "font-normal"
                  } ml-3 block truncate text-xl `}
                >
                  {item}
                </span>
              </div>

              {selectedFilter == item && (
                <span className="text-indigo-600  absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="h-5 w-5 "
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      className="stroke-[#5A5B80] dark:stroke-slate-300"
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SelectOptions;
