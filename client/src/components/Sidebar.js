import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ActiveIndicator, FinishedIndicator, PausedIndicator } from "./svg";

import { LazyLoadImage } from "react-lazy-load-image-component";

const Sidebar = ({
  allBoards,
  setAllBoards,
  selectedBoard,
  setSelectedBoard,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const SidebarLabels = [
    {
      label: "Home",
      labelItems: [
        {
          name: "Home",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                d="M 23.951172 4 A 1.50015 1.50015 0 0 0 23.070312 4.3222656 L 8.8730469 15.521484 C 7.0935305 16.919676 6 19.100391 6 21.400391 L 6 40.5 C 6 41.133333 6.2367979 41.80711 6.7148438 42.285156 C 7.1928895 42.763202 7.8666667 43 8.5 43 L 18.5 43 C 19.133333 43 19.80711 42.763202 20.285156 42.285156 C 20.763202 41.80711 21 41.133333 21 40.5 L 21 30.5 C 21 30.218182 21.218182 30 21.5 30 L 26.5 30 C 26.781818 30 27 30.218182 27 30.5 L 27 40.5 C 27 41.133333 27.236798 41.80711 27.714844 42.285156 C 28.19289 42.763202 28.866667 43 29.5 43 L 39.5 43 C 40.133333 43 40.80711 42.763202 41.285156 42.285156 C 41.763202 41.80711 42 41.133333 42 40.5 L 42 21.400391 C 42 19.155946 41.012069 16.901298 39.087891 15.490234 L 24.929688 4.3222656 A 1.50015 1.50015 0 0 0 23.951172 4 z M 24 7.4101562 L 37.271484 17.876953 A 1.50015 1.50015 0 0 0 37.3125 17.910156 C 38.388318 18.699095 39 20.044835 39 21.400391 L 39 40 L 30 40 L 30 30.5 C 30 28.581818 28.418182 27 26.5 27 L 21.5 27 C 19.581818 27 18 28.581818 18 30.5 L 18 40 L 9 40 L 9 21.400391 C 9 20.100391 9.7060794 18.680715 10.726562 17.878906 A 1.50015 1.50015 0 0 0 10.728516 17.876953 L 24 7.4101562 z"
                stroke="#5A5B80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          link: "/",
        },
        {
          name: "Boards",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 17V7M9 17C9 17.5304 8.78929 18.0391 8.41421 18.4142C8.03914 18.7893 7.53043 19 7 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H7C7.53043 5 8.03914 5.21071 8.41421 5.58579C8.78929 5.96086 9 6.46957 9 7M9 17C9 17.5304 9.21071 18.0391 9.58579 18.4142C9.96086 18.7893 10.4696 19 11 19H13C13.5304 19 14.0391 18.7893 14.4142 18.4142C14.7893 18.0391 15 17.5304 15 17M9 7C9 6.46957 9.21071 5.96086 9.58579 5.58579C9.96086 5.21071 10.4696 5 11 5H13C13.5304 5 14.0391 5.21071 14.4142 5.58579C14.7893 5.96086 15 6.46957 15 7M15 17V7M15 17C15 17.5304 15.2107 18.0391 15.5858 18.4142C15.9609 18.7893 16.4696 19 17 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H17C16.4696 5 15.9609 5.21071 15.5858 5.58579C15.2107 5.96086 15 6.46957 15 7"
                stroke="#5A5B80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          link: "/boards",
        },
        {
          name: "Messages",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M8 12H8.01H8ZM12 12H12.01H12ZM16 12H16.01H16ZM21 12C21 16.418 16.97 20 12 20C10.5286 20.005 9.07479 19.6808 7.745 19.051L3 20L4.395 16.28C3.512 15.042 3 13.574 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z"
                stroke="#5A5B80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          link: "/messages",
        },
        {
          name: "People",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 4.354C12.5374 3.7447 13.2477 3.31351 14.0362 3.11779C14.8247 2.92208 15.6542 2.97112 16.4142 3.2584C17.1741 3.54568 17.8286 4.05757 18.2905 4.72596C18.7524 5.39435 18.9998 6.18754 18.9998 7C18.9998 7.81246 18.7524 8.60565 18.2905 9.27404C17.8286 9.94243 17.1741 10.4543 16.4142 10.7416C15.6542 11.0289 14.8247 11.0779 14.0362 10.8822C13.2477 10.6865 12.5374 10.2553 12 9.646V4.354ZM15 21H3V20C3 18.4087 3.63214 16.8826 4.75736 15.7574C5.88258 14.6321 7.4087 14 9 14C10.5913 14 12.1174 14.6321 13.2426 15.7574C14.3679 16.8826 15 18.4087 15 20V21ZM15 21H21V20C21.0001 18.9467 20.723 17.9119 20.1965 16.9997C19.6699 16.0875 18.9125 15.3299 18.0004 14.8032C17.0882 14.2765 16.0535 13.9992 15.0002 13.9992C13.9469 13.9991 12.9122 14.2764 12 14.803L15 21ZM13 7C13 8.06087 12.5786 9.07828 11.8284 9.82843C11.0783 10.5786 10.0609 11 9 11C7.93913 11 6.92172 10.5786 6.17157 9.82843C5.42143 9.07828 5 8.06087 5 7C5 5.93913 5.42143 4.92172 6.17157 4.17157C6.92172 3.42143 7.93913 3 9 3C10.0609 3 11.0783 3.42143 11.8284 4.17157C12.5786 4.92172 13 5.93913 13 7V7Z"
                stroke="#5A5B80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          link: "/users",
        },
        {
          name: "My Tasks",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11 4C11 3.46957 11.2107 2.96086 11.5858 2.58579C11.9609 2.21071 12.4696 2 13 2C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5C15 5.26522 15.1054 5.51957 15.2929 5.70711C15.4804 5.89464 15.7348 6 16 6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V10C20 10.2652 19.8946 10.5196 19.7071 10.7071C19.5196 10.8946 19.2652 11 19 11H18C17.4696 11 16.9609 11.2107 16.5858 11.5858C16.2107 11.9609 16 12.4696 16 13C16 13.5304 16.2107 14.0391 16.5858 14.4142C16.9609 14.7893 17.4696 15 18 15H19C19.2652 15 19.5196 15.1054 19.7071 15.2929C19.8946 15.4804 20 15.7348 20 16V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H16C15.7348 20 15.4804 19.8946 15.2929 19.7071C15.1054 19.5196 15 19.2652 15 19V18C15 17.4696 14.7893 16.9609 14.4142 16.5858C14.0391 16.2107 13.5304 16 13 16C12.4696 16 11.9609 16.2107 11.5858 16.5858C11.2107 16.9609 11 17.4696 11 18V19C11 19.2652 10.8946 19.5196 10.7071 19.7071C10.5196 19.8946 10.2652 20 10 20H7C6.73478 20 6.48043 19.8946 6.29289 19.7071C6.10536 19.5196 6 19.2652 6 19V16C6 15.7348 5.89464 15.4804 5.70711 15.2929C5.51957 15.1054 5.26522 15 5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H5C5.26522 11 5.51957 10.8946 5.70711 10.7071C5.89464 10.5196 6 10.2652 6 10V7C6 6.73478 6.10536 6.48043 6.29289 6.29289C6.48043 6.10536 6.73478 6 7 6H10C10.2652 6 10.5196 5.89464 10.7071 5.70711C10.8946 5.51957 11 5.26522 11 5V4Z"
                stroke="#5A5B80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          link: "/users",
        },
      ],
    },
  ];

  return (
    <div className="sidebar  gap-12 items-start flex flex-col w-[30rem] px-[1.8rem] py-[2.4rem] h-[100vh] bg-purple">
      <div className="brand-name">
        <Link
          to="/"
          onClick={() => {
            setIsDropdownOpen(false);
            setSelectedBoard({});
          }}
          className="text-3xl font-bold  flex gap-5"
        >
          <LazyLoadImage
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            className="w-10 h-10"
          />

          <span className="text-heading">Kanbuddy</span>
        </Link>
      </div>

      <div className="allboards gap-5 w-full">
        <h3 className="text-purple font-[600] text-[1.7rem]">My Boards</h3>
        {/* ________________ Select Display Project _____________ */}
        <div className="relative w-full">
          <button
            onClick={handleDropdown}
            type="button"
            className="relative hover:bg-indigo-100 mt-3 w-full cursor-pointer flex justify-between ring-0 outline-none border-none rounded-md bg-transparent py-5 transition-all text-2xl  pl-3 pr-10 text-left text-heading focus:outline-none  sm:text-sm sm:leading-6"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-labelledby="listbox-label"
          >
            <span className="flex items-center">
              <svg
                width={15}
                height={15}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Indicator">
                  <circle id="Ellipse 1" cx="16" cy="16" r="8" fill="#5a5b80" />
                </g>
              </svg>
              <span className="ml-3 capitalize text-[1.35rem] text-purple font-semibold block truncate">
                {selectedBoard?.title || "Select Board"}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className={`transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                } transition-transform duration-300 ease-in-out`}
              >
                <path
                  d="M19 9L12 16L5 9"
                  stroke="#5A5B80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          <ul
            className={`absolute z-10   max-h-56   w-full transition-transform ease-in duration-200
             overflow-y-auto rounded-md bg-purple shadow-lg ring-2 ring-indigo-200
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
            {allBoards.length === 0 && (
              <span className="text-purple text-[1.35rem] font-semibold block truncate p-3">
                No Boards Found
              </span>
            )}
            {allBoards?.map((board, index) => {
              return (
                <Link
                  key={`${board?._id}-${index}`}
                  to={`/projects/${board.projectId}/board/${board._id}`}
                  onClick={() => {
                    setSelectedBoard(board);
                    setIsDropdownOpen(true && false);
                  }}
                  className="text-gray-900 flex relative cursor-pointer select-none  py-4 px-2 hover:text-indigo-600 hover:font-semibold hover:bg-indigo-100"
                >
                  <li id="listbox-option-0" role="option">
                    <div className="flex items-center">
                      <span
                        className={`${
                          selectedBoard?._id === board?._id
                            ? "font-bold"
                            : "font-[500]"
                        } ml-3 truncate text-xl flex gap-3`}
                      >
                        {board?.status == "active" ? (
                          <ActiveIndicator width="17" height="17" />
                        ) : board?.status == "paused" ? (
                          <PausedIndicator width="17" height="17" />
                        ) : (
                          <FinishedIndicator width="17" height="17" />
                        )}
                        <div className="flex items-center gap-5">
                          <span className="text-[1.35rem] text-purple capitalize">
                            {board?.title}
                          </span>
                        </div>
                      </span>
                    </div>
                  </li>
                  {selectedBoard?._id == board?._id && (
                    <span className="text-indigo-600  absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg
                        className="h-6 w-6 "
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke="#5A5B80"
                          strokeWidth="2"
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="labels flex flex-col gap-10 w-full">
        {SidebarLabels?.map((label, index) => (
          <div className="flex flex-col gap-5" key={index}>
            <h4 className="text-purple font-[600] text-[1.7rem]">
              {label.label}
            </h4>
            <ul className="label__list flex gap-5 flex-col ms-3 ">
              {label.labelItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="text-purple hover:bg-indigo-100 py-2 px-3 rounded-md"
                >
                  <li className="flex items-center gap-5">
                    {item.icon}
                    <span className="text-[1.4rem] font-medium">
                      {item.name}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
