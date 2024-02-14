import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getToken } from "../../utils/getToken";
import { decodeToken } from "react-jwt";

export const googleLogin = createAsyncThunk(
  "googleLogin",
  async (
    { username, email, profilePicture, clientId, email_verified },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/user/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            profilePicture,
            clientId,
            email_verified,
          }),
        }
      );
      const data = await res.json();
      console.log(data, "gogle login");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

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
      const res = await fetch(
        ` ${process.env.REACT_APP_SERVER_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
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
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );
      const data = await res.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "verifyEmail",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/user/verify-email/${id}/${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
const token = getToken();
if (token) {
  var user = decodeToken(token);
}

const initialState = {
  user: [],
  loading: false,
  isAdmin: user?.email === "naveenbasyal.001@gmail.com",
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
      state.isAdmin = false;
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
      state.isAdmin =
        action.payload?.user?.email === "naveenbasyal.001@gmail.com";
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
      state.loading = false;
      state.isAuthenticated = action.payload?.user?.verified ? true : false;

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
      state.loading = false;

      state.error = null;
    });
    builder.addCase(RegisterUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.loading = false;
      state.isAuthenticated = action.payload?.user?.verified ? true : false;
      state.error = null;
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
