import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Feedback = () => {
  const [loading, setLoading] = useState(false);
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
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/feedback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ title, message }),
            }
          );
          const data = await response.json();
          if (data.message) {
            toast.info(data.message, {
              position: "top-left",
            });
          }
          resetForm();
        } catch (err) {
          console.error(err);
          toast.error("Failed to submit feedback");
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <div className="p-10  mx-auto h-3/4 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 mx-20">
        <div className="text-center md:text-left md:col-span-1 space-y-10 flex flex-col items-center justify-center">
          <h2 className="text-8xl text-indigo-200 font-extrabold  dark:text-slate-400">
            Welcome to Our Feedback Platform
          </h2>
          <p className="text-purple dark:text-slate-300 mt-4 text-[1.65rem]">
            Share your thoughts, suggestions, or queries with us. We value your
            feedback and strive to provide the best experience for our users.
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
                <div className="text-red-500 mt-2 text-xl">{errors.title}</div>
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
                disabled={loading}
                className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent ${
                  loading
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
              >
                {loading ? (
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
  );
};

export default Feedback;
