import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PreLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white dark:bg-slate-800 z-50 animate-fade-in">
      <LazyLoadImage
        effect="blur"
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
        alt="Logo"
        className="h-24 w-24  animate-ping"
      />
    </div>
  );
};

export default PreLoader;
