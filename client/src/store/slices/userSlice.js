import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getSingleUser = createAsyncThunk(
  "getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("getsingleuser", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

const initialState = {
  user: {},
  loading: false,
  error: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSingleUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getSingleUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(getSingleUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export default userSlice.reducer;
