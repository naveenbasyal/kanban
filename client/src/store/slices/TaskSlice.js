import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const CreateNewTask = createAsyncThunk(
  "CreateNewTask",
  async ({ text, columnId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/task/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ text, columnId }),
        }
      );
      const data = await res.json();

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
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/task/`, {
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
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/task/updateTask`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ taskId, text, labels, flagged }),
        }
      );
      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);
export const AssignTaskToMember = createAsyncThunk(
  "AssignTaskToMember",
  async ({ taskId, memberId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/task/assign-task`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ taskId, memberId }),
        }
      );
      const data = await res.json();

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
  assignLoading: false,
  editLoading: false,
  deleteLoading: false,
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
      state.editLoading = true;
    });
    builder.addCase(updateTaskById.fulfilled, (state, action) => {
      state.editLoading = false;
    });
    builder.addCase(updateTaskById.rejected, (state, action) => {
      state.editLoading = false;
      state.error = action.payload;
    });
    builder.addCase(AssignTaskToMember.pending, (state, action) => {
      state.assignLoading = true;
    });
    builder.addCase(AssignTaskToMember.fulfilled, (state, action) => {
      state.assignLoading = false;
    });
    builder.addCase(AssignTaskToMember.rejected, (state, action) => {
      state.assignLoading = false;
      state.error = action.payload;
    });
  },
});

export default taskSlice.reducer;
