import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./slices/projectSlice";
import userSlice from "./slices/userSlice";
import boardSlice from "./slices/boardSlice";
import taskSlice from "./slices/TaskSlice";
import columnSlice from "./slices/columnSlice";
import authSlice from "./slices/authSlice";
import feedbackSlice from "./slices/feedback";
const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectSlice,
    user: userSlice,
    board: boardSlice,
    task: taskSlice,
    column: columnSlice,
    feedback: feedbackSlice,
  },
  devTools: false,
});

export default store;
