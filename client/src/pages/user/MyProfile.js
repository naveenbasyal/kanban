import React, { Fragment, useEffect, useRef, useState } from "react";
import { useUser } from "../../Context/userContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import { updateUserName } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

const MyProfile = ({ openProfile, setOpenProfile }) => {
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);

  const { user, setUser } = useUser();
  const { loading } = useSelector((state) => state.user);

  const [image, setImage] = useState(null);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    setImage(user?.profilePicture);
    setEditName(user?.username);
  }, [user]);

  const handleChangeName = async () => {
    const data = await dispatch(updateUserName({ name: editName }));

    if (data?.payload) {
      setUser({ ...user, username: editName });
      setToggleEdit(false);
      setEditName("");
    } else {
      toast.error("Failed to update name");
      setToggleEdit(false);
      setEditName("");
    }
  };

  return (
    <Transition.Root show={openProfile ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpenProfile}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4  sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative  flex flex-col justify-between gap-10 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all  sm:my-8 sw-fit max-w-3xl">
                <section className="flex profile font-medium items-center justify-center h-3/4">
                  <section className="bg-[#ebf1ff]  rounded-2xl p-10 ">
                    <div className="flex items-center justify-between">
                      <span className="text-purple text-md">
                        {new Date(user?.createdAt).toDateString()}
                      </span>
                      <span
                        ref={cancelButtonRef}
                        onClick={() => setOpenProfile(false)}
                        className="text-gray-600 cursor-pointer hover:bg-gray-50 p-3 rounded-full"
                      >
                        <IoClose size={20} />
                      </span>
                    </div>
                    <div className="mt-6 w-fit mx-auto">
                      <LazyLoadImage
                        src={user?.profilePicture || image}
                        width={130}
                        height={130}
                        effect="blur"
                        className="rounded-full  "
                        alt={user?.username}
                      />
                    </div>

                    <div className="tracking-wide my-5 flex items-center">
                      {toggleEdit ? (
                        <div className="flex gap-10 items-center">
                          <input
                            type="text"
                            value={editName}
                            placeholder="Enter your name"
                            onChange={(e) => setEditName(e.target.value)}
                            className=" rounded-md  outline-none border-transparent shadow-inner text-2xl p-3 font-semibold ring-0  focus:ring-transparent placeholder:text-purple focus:ring-0 focus:drop-shadow-lg "
                          />
                          <div className="buttons flex text-xl">
                            <button
                              onClick={() => setToggleEdit(!toggleEdit)}
                              className="bg-gray-100 border-[1px] h-full text-gray-500 p-4  rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={loading}
                              onClick={handleChangeName}
                              className={`${
                                loading
                                  ? "bg-gray-500 cursor-not-allowed"
                                  : "bg-indigo-600"
                              } border-[1px] text-white w-28 p-4 rounded-md flex items-center justify-center`}
                            >
                              {loading ? (
                                <AiOutlineLoading
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-10">
                          <span className="text-heading font-extrabold text-[2.6rem] ">
                            {user?.username}
                          </span>
                          <span
                            onClick={() => setToggleEdit(!toggleEdit)}
                            className="hover:bg-indigo-100 py-3 px-5 transition-colors duration-300 text-gray-500 cursor-pointer hover:text-gray-800 rounded-full flex items-center justify-center"
                          >
                            <FaPencilAlt size={14} />
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-500 flex gap-2 font-semibold  text-xl">
                      <span className="text-heading">Bio: </span>
                      {user?.bio}
                    </p>

                    {/* __ Email ___ */}
                    <div className="flex flex-col gap-6 text-xl text-purple mt-7">
                      <div className="grid grid-cols-2">
                        <div className="left flex flex-col">
                          <span>Email </span>
                        </div>
                        <div className="right ">
                          <span className="break-all">{user?.email} </span>
                        </div>
                      </div>
                      {/* __ Projects ___ */}
                      <div className="grid grid-cols-2  ">
                        <div className="left flex flex-col">
                          <span>Projects </span>
                        </div>
                        <div className="right ">
                          <span className="break-all">
                            {user?.projects?.length}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MyProfile;
