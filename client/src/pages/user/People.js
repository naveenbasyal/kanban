import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/slices/userSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineLoading } from "react-icons/ai";

const People = () => {
  const dispatch = useDispatch();
  const { allusers, loading } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  return (
    <div className="p-10 ml-5 mt-5">
      <div className="w-full ">
        <h2 className="text-5xl font-bold text-heading dark:text-white">
          People
        </h2>
      </div>
      {/* make a table to show all the users */}
      {loading ? (
        <div className="w-full my-10 text-slate-500 h-2 text-xl dark:text-slate-400">
          <div className="flex gap-4 items-center">
            Loading Users <AiOutlineLoading className="animate-spin-fast .4s" />
          </div>
        </div>
      ) : (
        <div
          className="mt-2 p-4 relative z-10 bg-indigo-50  rounded-xl sm:mt-10 md:p-10
       dark:bg-slate-800"
        >
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b-2 dark:border-slate-700">
                  <th className="py-2 px-4 text-[1.35rem] font-bold text-purple dark:text-slate-200">
                    User Image
                  </th>
                  <th className="py-2 px-4 text-[1.35rem] font-bold text-purple dark:text-slate-200">
                    Name
                  </th>
                  <th className="py-2 px-4 text-[1.35rem] font-bold text-purple dark:text-slate-200">
                    Bio
                  </th>
                  <th className="py-2 px-4 text-[1.35rem] font-bold text-purple dark:text-slate-200">
                    Email
                  </th>
                  <th className="py-2 px-4 text-[1.35rem] font-bold text-purple dark:text-slate-200">
                    Joined on
                  </th>
                </tr>
              </thead>
              <tbody>
                {allusers?.map((user) => (
                  <tr key={user._id} className="border-b dark:border-slate-700">
                    <td className="py-4 px-4">
                      <LazyLoadImage
                        src={user.profilePicture}
                        alt="profile"
                        effect="blur"
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-full"
                      />
                    </td>
                    <td className="py-4 px-4 text-purple text-xl dark:text-slate-200">
                      {user.username}
                    </td>
                    <td className="py-4 px-4 text-purple text-xl dark:text-slate-200">
                      {user.bio}
                    </td>
                    <td className="py-4 px-4 text-blue-500 text-xl dark:text-blue-500">
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td className="py-4 px-4 text-purple text-xl dark:text-slate-200">
                      {/* date with time */}
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default People;
