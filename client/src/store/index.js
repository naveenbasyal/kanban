import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./slices/projectSlice";
import userSlice from "./slices/userSlice";
import boardSlice from "./slices/boardSlice";
import taskSlice from "./slices/TaskSlice";
import columnSlice from "./slices/columnSlice";
const store = configureStore({
  reducer: {
    projects: projectSlice,
    user: userSlice,
    board: boardSlice,
    task: taskSlice,
    column: columnSlice,
  },
});

export default store;
