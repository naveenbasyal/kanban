import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AiOutlineLoading } from "react-icons/ai";
import { useUser } from "../Context/userContext";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getAllFeedbacks } from "../store/slices/feedback";

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
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);

  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { user } = useUser();

  const { feedbacks, loading } = useSelector((state) => state.feedback);

  useEffect(() => {
    dispatch(getAllFeedbacks());
  }, []);

  const handleAddcomment = async (id) => {
    try {
      setCommentLoading(true);
      const response = await fetch(
        `${
          "http://localhost:8000" || process.env.REACT_APP_SERVER_URL
        }/api/feedback/comment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message: newComment, feedbackId: id }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data?.message) {
        toast.info(data.message);
        setNewComment("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };
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
        feedbacks?.map(({ userId, title, message, _id, comments }) => (
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

            <AccordionBody className="text-2xl px-3 py-5 bg-slate-100 dark:bg-slate-800 rounded-md text-gray-600 dark:text-slate-300">
              <div className="ml-4 text-2xl capitalize my-4">{message}</div>
              <div className="comments my-5 mx-5">
                <h3 className="text-xl mt-4 font-semibold dark:text-slate-200">
                  Comments
                </h3>
                <div className="mt-2 flex flex-col gap-y-3 dark:text-slate-300 py-4 text-slate-500">
                  {comments?.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment?._id}
                        className={`mb-2  flex gap-4 
                        ${
                          comment.userId === user?._id
                            ? "justify-end "
                            : "justify-start"
                        }
                        `}
                      >
                        <div className="w-[85%] flex gap-3">
                          {comment.userId === user?._id ? (
                            <LazyLoadImage
                              src={
                                user?.profilePicture ||
                                `https://api.dicebear.com/7.x/bottts/svg?seed=${
                                  user?.username?.toLowerCase()?.split(" ")[0]
                                }`
                              }
                              effect="blur"
                              className="h-10 w-10 rounded-full object-cover"
                              alt={user?.username}
                              title={user?.username}
                            />
                          ) : (
                            <LazyLoadImage
                              src={userId?.profilePicture}
                              effect="blur"
                              className="h-10 w-10 rounded-full object-cover"
                              alt={userId?.username}
                              title={userId?.username}
                            />
                          )}
                          <div className="comment-header flex flex-col bg-slate-200 dark:bg-slate-700 p-4 rounded-lg w-full">
                            <p className="text-lg font-semibold dark:text-slate-200">
                              {comment.userId?.username}
                            </p>
                            <p className="text-md text-slate-400 dark:text-slate-300">
                              {formatDistanceToNow(
                                new Date(comment.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                            <p className="text-xl my-2">{comment.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet</p>
                  )}
                </div>
              </div>
              {/* add comment */}
              <div className="flex items-center gap-10 justify-between p-3 bg-gray-100 dark:bg-slate-800 rounded-b-md">
                <textarea
                  rows={4}
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 text-2xl rounded-lg border-0 focus:ring-0 focus:border-0 dark:text-slate-300 dark:bg-slate-700"
                />
                <button
                  disabled={commentLoading}
                  onClick={() => handleAddcomment(_id)}
                  className={`px-4 py-3 w-40 flex items-center justify-center 
                  ${
                    commentLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600  hover:bg-indigo-500 "
                  }
                    rounded-md text-white`}
                >
                  {commentLoading ? (
                    <AiOutlineLoading className="animate-spin-fast" />
                  ) : (
                    "Comment"
                  )}
                </button>
              </div>
            </AccordionBody>
          </Accordion>
        ))
      ) : (
        <h1>No feedbacks available</h1>
      )}
    </div>
  );
}
