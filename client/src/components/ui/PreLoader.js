import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PreLoader = ({ verifyEmail }) => {
  return (
    <div className="fixed  top-0 left-0 w-screen h-screen flex flex-col gap-10 items-center justify-center bg-white dark:bg-slate-800 z-50 animate-fade-in">
      <LazyLoadImage
        effect="blur"
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
        alt="Logo"
        className="h-24 w-24  animate-ping"
      />
      {verifyEmail && (
        <h1 className="text-2xl  font-semibold text-center  text-gray-600 dark:text-gray-200">
          Verifying your email...
        </h1>
      )}
    </div>
  );
};

export default PreLoader;
