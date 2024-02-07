import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createNewProject = createAsyncThunk(
  "createNewProject",
  async (values, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/project/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const getAllUserProjects = createAsyncThunk(
  "getAllUserProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/project/`, {
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
export const getAllProjects = createAsyncThunk(
  "getAllProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/project/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      // console.log("all global projects", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const deleteSingleProject = createAsyncThunk(
  "deleteSingleProject",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/project/`, {
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
      return rejectWithValue(err.response);
    }
  }
);
export const UpdateProjectBasic = createAsyncThunk(
  "UpdateProjectBasic",
  async ({ projectId, title, description, team }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/project/updateBasic`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ projectId, title, description, team }),
      });
      const data = await res.json();

      return data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const handleStarredProject = createAsyncThunk(
  "handleStarredProject",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/project/starred-project`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ projectId }),
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
  projects: [],
  allProjects: [],
  loading: false,
  editLoading: false,
  error: null,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createNewProject.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createNewProject.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = [...state.projects, action.payload];
    });
    builder.addCase(createNewProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAllUserProjects.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllUserProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = action.payload;
    });
    builder.addCase(getAllUserProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAllProjects.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.allProjects = action.payload;
    });
    builder.addCase(getAllProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteSingleProject.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteSingleProject.fulfilled, (state, action) => {
      state.loading = false;
      const filteredProjects = state.projects.filter(
        (project) => project._id != action.payload.project._id
      );
      state.projects = filteredProjects;
    });
    builder.addCase(deleteSingleProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(UpdateProjectBasic.pending, (state, action) => {
      state.editLoading = true;
    });
    builder.addCase(UpdateProjectBasic.fulfilled, (state, action) => {
      state.editLoading = false;
    });
    builder.addCase(UpdateProjectBasic.rejected, (state, action) => {
      state.editLoading = false;
      state.error = action.payload;
    });
    builder.addCase(handleStarredProject.pending, (state, action) => {
      state.editLoading = true;
    });
    builder.addCase(handleStarredProject.fulfilled, (state, action) => {
      state.editLoading = false;
    });
    builder.addCase(handleStarredProject.rejected, (state, action) => {
      state.editLoading = false;
      state.error = action.payload;
    });
  },
});

export default projectSlice.reducer;
