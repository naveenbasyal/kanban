import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getSingleUser = createAsyncThunk(
  "getSingleUser",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/user/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const updateUserName = createAsyncThunk(
  "updateUserName",
  async ({ name }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/user/update-name`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name }),
        }
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);


const initialState = {
  user: {},
  allusers: [],
  loading: false,
  error: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      state.user = {};
      state.allusers = [];
      state.loading = false;
      state.error = null;
    },
  },
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
    builder.addCase(getAllUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.allusers = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateUserName.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateUserName.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateUserName.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
