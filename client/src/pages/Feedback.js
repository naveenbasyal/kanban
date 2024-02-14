import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUser } from "../Context/userContext";
import { AiOutlineLoading } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";

import {
  getUserFeedbacks,
  handleAddcomment,
  handlePostFeedback,
} from "../store/slices/feedback";

const Feedback = () => {
  const dispatch = useDispatch();
  const { loading, commentLoading, userFeedbacks, postFeedbackLoading } =
    useSelector((state) => state.feedback);

  const { user } = useUser();

  const [newComment, setNewComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [expandedFeedbacks, setExpandedFeedbacks] = useState([]);
  const [inputId, setInputId] = useState("");
  const [commentId, setCommentId] = useState("");

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        title: "",
        message: "",
      },
      validationSchema: Yup.object({
        title: Yup.string()
          .required("Title is required")
          .min(3, "Come on, even a cat can type a longer title!")
          .max(
            50,
            "Now, that's longer than the time I spend deciding what to watch on Netflix!"
          ),
        message: Yup.string()
          .required(
            "Message is required. It's not like we can read minds... yet!"
          )
          .min(10, "Your message is too short. Please elaborate more."),
      }),

      onSubmit: async (values, { resetForm }) => {
        const { title, message } = values;
        const data = await dispatch(handlePostFeedback({ title, message }));
        console.log(data)
        if (data?.meta?.requestStatus === "fulfilled") {
          resetForm();
          dispatch(getUserFeedbacks());
        }
      },
    });

  useEffect(() => {
    dispatch(getUserFeedbacks());
  }, []);
  useEffect(() => {
    setFeedbacks(userFeedbacks);
  }, [userFeedbacks]);

  const handleComment = async (e, id) => {
    e.preventDefault();

    const updatedFeedbacks = feedbacks.map((feedback) => {
      if (feedback._id === id) {
        return {
          ...feedback,
          comments: [
            ...feedback.comments,
            {
              message: newComment,
              userId: user,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return feedback;
    });

    setFeedbacks(updatedFeedbacks);
    const data = await dispatch(
      handleAddcomment({ message: newComment, feedbackId: id })
    );
    if (data?.meta?.requestStatus === "fulfilled") {
      setNewComment("");
      dispatch(getUserFeedbacks());
      setInputId("");
      setCommentId("");
    }
  };

  return (
    <>
      <div className="p-10  px-20 h-3/4 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 ">
          <div className="text-center md:text-left md:col-span-1 space-y-10 flex flex-col items-center justify-center">
            <h2 className="text-8xl text-indigo-200 font-extrabold  dark:text-slate-400">
              Welcome to Our Feedback Platform
            </h2>
            <p className="text-purple dark:text-slate-300 mt-4 text-[1.65rem]">
              Share your thoughts, suggestions, or queries with us. We value
              your feedback and strive to provide the best experience for our
              users.
            </p>
          </div>
          <div
            className="mt-5 p-4 relative z-10 bg-white border rounded-xl sm:mt-10 md:p-10
        border-slate-300
        dark:bg-slate-900 dark:border-slate-700"
          >
            <form className="flex flex-col gap-5 py-6" onSubmit={handleSubmit}>
              <div className="mb-4 sm:mb-8">
                <label
                  htmlFor="title"
                  className="block mb-2 text-[1.35rem] font-medium dark:text-slate-200 text-purple capitalize"
                >
                  Title
                </label>
                <input
                  type="text"
                  value={values.title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="title"
                  id="title"
                  className="py-4 px-4 block w-full placeholder-slate-400 text-purple border-slate-300 rounded-lg text-[1.35rem] focus:border-slate-400 focus:ring-slate-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:ring-slate-600"
                  placeholder="What's the title?"
                />
                {errors.title && touched.title ? (
                  <div className="text-red-500 mt-2 text-xl">
                    {errors.title}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-[1.35rem] font-medium dark:text-slate-200 text-purple"
                >
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    value={values.message}
                    onBlur={handleBlur}
                    name="message"
                    onChange={handleChange}
                    id="message"
                    rows="5"
                    className="py-4 px-4 block w-full placeholder-slate-400 text-purple border-slate-300 rounded-lg text-[1.35rem] focus:border-slate-400 focus:ring-slate-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:ring-slate-600"
                    placeholder="Leave your message here..."
                  ></textarea>
                  {errors.message && touched.message ? (
                    <div className="text-red-500 mt-2 text-xl">
                      {errors.message}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={postFeedbackLoading}
                  className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent ${
                    loading
                      ? "bg-slate-500 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  } text-white disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                >
                  {postFeedbackLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.009 8.009 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* _________ User's Feedback ___________ */}
      <div className="w-full mt-10 px-20 text-slate-500 h-2 text-xl dark:text-slate-400 ">
        {loading && (
          <div className="flex gap-4 items-center">
            Loading your feedbacks{" "}
            <AiOutlineLoading className="animate-spin-fast .4s" />
          </div>
        )}
      </div>

      {feedbacks?.length > 0 && (
        <div className="p-10 px-20 mb-32">
          <h2 className="text-6xl mb-10 font-semibold text-indigo-500 dark:text-slate-200">
            Your Feedbacks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="p-10 h-fit rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <div className="user-feedback">
                  <h3 className="text-2xl capitalize font-semibold text-indigo-500 dark:text-slate-200">
                    {feedback.title}
                  </h3>
                  <p className="text-xl capitalize mt-2 text-slate-500 dark:text-slate-300">
                    {feedback.message}
                  </p>
                </div>
                {/* _____________ Comments ________ */}
                <div className="comments">
                  <div className="mt-2 flex flex-col gap-y-3 dark:text-slate-300 py-4 text-slate-500">
                    {feedback.comments?.length > 0 ? (
                      <>
                        <h3 className="text-xl mt-4 font-semibold dark:text-slate-200">
                          Comments
                        </h3>
                        {expandedFeedbacks.includes(feedback._id) ? (
                          feedback.comments.map((comment, index) => (
                            // Render all comments
                            <div
                              key={comment?._id}
                              className={`mb-2  flex gap-4 
                              ${
                                comment.userId?._id === user?._id
                                  ? "justify-end "
                                  : "justify-start"
                              }
                            `}
                            >
                              <div className="w-[85%] flex">
                                <div className="user-image p-2">
                                  <LazyLoadImage
                                    referrerPolicy="no-referrer"
                                    src={
                                      comment.userId?.profilePicture ||
                                      `https://api.dicebear.com/7.x/bottts/svg?seed=${
                                        comment.userId?.username
                                          ?.toLowerCase()
                                          ?.split(" ")[0]
                                      }`
                                    }
                                    effect="blur"
                                    className="h-10 w-10 rounded-full object-cover"
                                    alt={comment.userId?.username}
                                    title={comment.userId?.username}
                                  />
                                </div>
                                <div className="comment-header flex flex-col bg-slate-100 dark:bg-slate-700 p-4 rounded-lg w-full">
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
                                  <p className="text-xl my-2">
                                    {comment.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            {feedback.comments
                              .slice(-2) // Show the latest 2 comments
                              .map((comment, index) => (
                                <div
                                  key={comment?._id}
                                  className={`mb-2  flex gap-4 
                              ${
                                comment.userId?._id === user?._id
                                  ? "justify-end "
                                  : "justify-start"
                              }
                            `}
                                >
                                  <div className="w-[85%] flex">
                                    <div className="user-image p-2">
                                      <LazyLoadImage
                                        referrerPolicy="no-referrer"
                                        src={
                                          comment.userId?.profilePicture ||
                                          `https://api.dicebear.com/7.x/bottts/svg?seed=${
                                            comment.userId?.username
                                              ?.toLowerCase()
                                              ?.split(" ")[0]
                                          }`
                                        }
                                        effect="blur"
                                        className="h-10 w-10 rounded-full object-cover"
                                        alt={comment.userId?.username}
                                        title={comment.userId?.username}
                                      />
                                    </div>
                                    <div className="comment-header flex flex-col bg-slate-100 dark:bg-slate-700 p-4 rounded-lg w-full">
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
                                      <p className="text-xl my-2">
                                        {comment.message}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </>
                        )}

                        {/* "See More" button */}
                        {feedback.comments.length > 2 && (
                          <button
                            onClick={() =>
                              setExpandedFeedbacks((prev) =>
                                prev.includes(feedback._id)
                                  ? prev.filter((id) => id !== feedback._id)
                                  : [...prev, feedback._id]
                              )
                            }
                            className="text-indigo-500 text-xl  dark:text-slate-200 mt-2 cursor-pointer"
                          >
                            {expandedFeedbacks.includes(feedback._id)
                              ? "See Less"
                              : "See More"}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="w-full my-1 text-xl text-slate-500 font-[500]">
                        No comments yet
                      </p>
                    )}
                  </div>
                  {/* add comment */}
                  <form
                    className="flex gap-4 items-center"
                    onSubmit={(e) => handleComment(e, feedback._id)}
                  >
                    <input
                      type="text"
                      name="comment"
                      id="comment"
                      value={inputId === feedback._id ? newComment : ""}
                      onFocus={() => setInputId(feedback._id)}
                      onChange={(e) => {
                        if (inputId === feedback._id) {
                          setCommentId(feedback._id);
                          setNewComment(e.target.value);
                        }
                      }}
                      placeholder="Add a comment"
                      className="py-4 px-4 w-full text-slate-500 text-xl border focus:ring-1 focus:ring-slate-300 border-slate-300 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className={`w-32 flex items-center justify-center ${
                        commentLoading && commentId === feedback?._id
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      } text-white py-4 text-xl px-4 rounded-lg`}
                    >
                      {commentLoading && commentId === feedback?._id ? (
                        <AiOutlineLoading className="animate-spin-fast" />
                      ) : (
                        "Comment"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {feedbacks?.length === 0 && !loading && (
        <div className="text-center px-20">
          <p>You haven't submitted any feedback yet.</p>
        </div>
      )}
    </>
  );
};

export default Feedback;
