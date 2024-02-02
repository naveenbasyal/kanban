import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const CreateNewBoard = createAsyncThunk(
  "CreateNewBoard",
  async ({ values, projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/board/${projectId}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      console.log("new Board", data.finalBoard);
      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);
export const DeleteBoardById = createAsyncThunk(
  "DeleteBoardById",
  async ({ id, projectId }, { rejectWithValue }) => {
    console.log(id, projectId);

    try {
      const res = await fetch(`http://localhost:8000/api/board/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);
export const UpdateBoardById = createAsyncThunk(
  "UpdateBoardById",
  async (
    {
      destinationColumnId,
      sourceColumnId,
      sourceIndex,
      destinationIndex,
      taskId,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`http://localhost:8000/api/board/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          destinationColumnId,
          sourceColumnId,
          destinationIndex,
          taskId,
          sourceIndex,
        }),
      });
      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);

// __________ Edit Board Name or Description __________
export const UpdateBoardNameOrDescription = createAsyncThunk(
  "UpdateBoardNameOrDescription",
  async ({ boardId, title, description, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/board/editNameDescription`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ boardId, title, description, status }),
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
  board: [],
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreateNewBoard.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(CreateNewBoard.fulfilled, (state, action) => {
      state.loading = false;
      state.board = action.payload;
    });
    builder.addCase(CreateNewBoard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(DeleteBoardById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteBoardById.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(DeleteBoardById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(UpdateBoardById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UpdateBoardById.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(UpdateBoardById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default boardSlice.reducer;
