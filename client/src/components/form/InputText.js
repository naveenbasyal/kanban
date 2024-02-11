import React from "react";

const InputForm = (props) => {
  return (
    <div>
      {props.label && (
        <label
          htmlFor="label"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {props.label}
        </label>
      )}
      <div className="relative  rounded-sm shadow-sm flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex z-50 items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{props.icon}</span>
        </div>
        <input
          type="text"
          name="label"
          id="label"
          className={`${props.width} block lg:text-xl bg-purple dark:bg-slate-800 outline-none rounded-md border-0 ${props.pl} ${props.py} ${props.pr} text-purple dark:text-slate-300 ring-1 ring-inset ring-transparent placeholder:text-purple dark:placeholder:text-slate-300 focus:ring-2 focus:ring-[#7c91f1] dark:focus:ring-slate-700 focus:drop-shadow-lg   sm:text-sm sm:leading-6`}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
};

export default InputForm;
