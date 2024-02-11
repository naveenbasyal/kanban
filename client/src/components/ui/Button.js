import React from "react";

const Button = ({ width, title, icon, bg, color, setCreateProject }) => {
  return (
    <button
      onClick={() => setCreateProject(true)}
      className={`flex transition-all duration-200 shadow-md dark:hover:shadow-none hover:translate-y-[-2px] hover:shadow-gray-600 rounded-md p-4 bg-dark-color dark:bg-slate-700 justify-center items-center gap-5 self-stretch ${width}`}
    >
      <span className={`text-[1.4rem] font-medium ${color}`}>{title}</span>
      <span>{icon}</span>
    </button>
  );
};

export default Button;
