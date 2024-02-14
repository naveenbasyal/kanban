import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AiOutlineLoading } from "react-icons/ai";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function AllFeedbacks() {
  const [open, setOpen] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/feedback`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        
        if (data?.feedbacks) {
          setFeedbacks(data.feedbacks);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch feedbacks");
      } finally {
        setLoading(false);
      }
    };

    getAllFeedbacks();
  }, []);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className="p-10 max-w-[80rem] mb-20 ml-10 mt-4 bg-white dark:bg-slate-900 space-y-4">
      <h3 className="text-4xl mb-10 text-heading dark:text-slate-300 font-semibold">
        All Feedbacks
      </h3>
      {loading && (
        <div className="flex items-center justify-start text-xl text-slate-600 font-[500]">
          Loading{" "}
          <AiOutlineLoading className="animate-spin-fast h-5 w-5 ml-4" />
        </div>
      )}
      {feedbacks?.length > 0 ? (
        feedbacks?.map(({ userId, title, message, _id }) => (
          <Accordion
            key={_id}
            open={open === _id}
            icon={<Icon id={_id} open={open} />}
            className="border-b-[1px] border-b-slate-200 dark:border-b-slate-700"
          >
            <AccordionHeader onClick={() => handleOpen(_id)}>
              <div className=" flex items-center gap-6">
                <LazyLoadImage
                  src={
                    userId?.profilePicture ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${
                      userId?.username?.toLowerCase()?.split(" ")[0]
                    }`
                  }
                  effect="blur"
                  className="h-12 w-12 rounded-full object-cover"
                  alt={userId?.username}
                  title={userId?.username}
                />
                <span className="capitalize text-2xl text-purple dark:text-slate-300 font-medium">
                  {title}
                </span>
              </div>
            </AccordionHeader>

            <AccordionBody className="text-2xl px-3 py-5 bg-gray-100 dark:bg-slate-800 rounded-md text-gray-600 dark:text-slate-300">
              {message}
            </AccordionBody>
          </Accordion>
        ))
      ) : (
        <h1>No feedbacks available</h1>
      )}
    </div>
  );
}
