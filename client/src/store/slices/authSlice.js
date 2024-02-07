import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getToken } from "../../utils/getToken";

export const googleLogin = createAsyncThunk(
  "googleLogin",
  async (
    { username, email, profilePicture, clientId, email_verified },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`http://localhost:8000/api/user/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          profilePicture,
          clientId,
          email_verified,
        }),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      console.log("login", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  }
);

export const LoginUser = createAsyncThunk(
  "LoginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      console.log("login", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const RegisterUser = createAsyncThunk(
  "RegisterUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (data.user) {
        console.log(data.user);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const initialState = {
  user: [],
  loading: false,
  isAuthenticated: getToken() ? true : false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(googleLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(googleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(LoginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(RegisterUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(RegisterUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(RegisterUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
