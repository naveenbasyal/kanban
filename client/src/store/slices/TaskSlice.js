import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const CreateNewTask = createAsyncThunk(
  "CreateNewTask",
  async ({ text, columnId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text, columnId }),
      });
      const data = await res.json();
      console.log("new Task", data);
      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);
export const DeleteTaskById = createAsyncThunk(
  "DeleteTaskById",
  async ({ id, columnId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/task/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id, columnId }),
      });
      const data = await res.json();
      // console.log("Task Deleted", data);
      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);
export const updateTaskById = createAsyncThunk(
  "updateTaskById",
  async ({ taskId, text, labels, flagged }, { rejectWithValue }) => {
    console.log(text, labels);
    try {
      const res = await fetch(`http://localhost:8000/api/task/updateTask`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ taskId, text, labels, flagged }),
      });
      const data = await res.json();
      console.log("Task Updated", data);
      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);

const initialState = {
  task: {},
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreateNewTask.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(CreateNewTask.fulfilled, (state, action) => {
      state.loading = false;
      state.task = action.payload;
    });
    builder.addCase(CreateNewTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(DeleteTaskById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteTaskById.fulfilled, (state, action) => {
      state.loading = false;
      state.board = action.payload;
    });
    builder.addCase(DeleteTaskById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateTaskById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateTaskById.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateTaskById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default taskSlice.reducer;
