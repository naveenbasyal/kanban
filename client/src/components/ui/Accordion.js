import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Accordion = ({ selectedProject, setSelectedProject, projects }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // console.log("Accordion Changed");

  return (
    <div
      className={`accordion bg-${
        isOpen ? "purple" : "transparent"
      } p-4 transition-colors  duration-300 ease-in-out w-full`}
    >
      <div
        className="flex items-center cursor-pointer justify-between gap-5"
        onClick={toggleAccordion}
      >
        <div className="flex-1 text-purple text-[1.4rem] font-[500]">
          {selectedProject?.title}
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={`transform ${
              isOpen ? "rotate-180" : "rotate-0"
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
        </div>
      </div>
      <ul className="project__list mt-3 flex flex-col ml-5 transition-all duration-300">
        {isOpen &&
          projects?.map(
            (project, index) =>
              project._id != selectedProject._id && (
                <li
                  key={index}
                  className="project__item  cursor-pointer transition-all duration-300 hover:bg-indigo-100 rounded-md text-purple flex justify-between items-end"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsOpen(false);
                    localStorage.setItem(
                      "selectedProject",
                      JSON.stringify(project)
                    );
                  }}
                >
                  <div className="flex items-center gap-2 py-2">
                    <div className="project-logo px-2">
                      <img
                        alt="project logo"
                        className="rounded-full w-10  object-cover"
                        src={project.logo}
                      />
                    </div>
                    <span className="text-[1.28rem] p-2 font-medium">
                      {project.title}
                    </span>
                  </div>
                </li>
              )
          )}
      </ul>
    </div>
  );
};

export default Accordion;
