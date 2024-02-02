import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const CreateNewColumn = createAsyncThunk(
  "CreateNewColumn",
  async ({ name, boardId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/column/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, boardId }),
      });
      const data = await res.json();
      console.log("new Column", data);
      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);
export const DeleteColumnById = createAsyncThunk(
  "DeleteColumnById",
  async ({ columnId, boardId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/column/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ columnId, boardId }),
      });
      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);

export const UpdateColumnOrder = createAsyncThunk(
  "UpdateColumnOrder",
  async (
    { boardId, columnId, sourceIndex, destinationIndex },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`http://localhost:8000/api/column/updateOrder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          boardId,
          columnId,
          sourceIndex,
          destinationIndex,
        }),
      });
      const data = await res.json();
      console.log("Column Reorder Done", data);
      return data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);

const initialState = {
  column: [],
  loading: false,
  error: null,
};

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreateNewColumn.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(CreateNewColumn.fulfilled, (state, action) => {
      state.loading = false;
      state.column = action.payload;
    });
    builder.addCase(CreateNewColumn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(DeleteColumnById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteColumnById.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(DeleteColumnById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(UpdateColumnOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UpdateColumnOrder.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(UpdateColumnOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default columnSlice.reducer;
