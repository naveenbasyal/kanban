import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserFeedbacks = createAsyncThunk(
  "getUserFeedbacks",
  async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/feedback/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("user feedbacks", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllFeedbacks = createAsyncThunk("getAllFeedbacks", async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/feedback`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
});

export const handleAddcomment = createAsyncThunk(
  "handleAddcomment",
  async ({ message, feedbackId }) => {
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/feedback/comment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message, feedbackId }),
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const handlePostFeedback = createAsyncThunk(
  "handlePostFeedback",
  async ({ title, message }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/feedback/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title, message }),
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    userFeedbacks: [],
    loading: false,
    commentLoading: false,
    postFeedbackLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // _______________ all feedbacks _______________
    builder.addCase(getAllFeedbacks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllFeedbacks.fulfilled, (state, action) => {
      state.feedbacks = action.payload.feedbacks;
      state.loading = false;
    });
    builder.addCase(getAllFeedbacks.rejected, (state) => {
      state.loading = false;
    });
    // _______________ user feedbacks _______________
    builder.addCase(getUserFeedbacks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserFeedbacks.fulfilled, (state, action) => {
      state.userFeedbacks = action.payload?.feedbacks;
      state.loading = false;
    });
    builder.addCase(getUserFeedbacks.rejected, (state) => {
      state.loading = false;
    });
    // _______________ add comment _______________
    builder.addCase(handleAddcomment.pending, (state) => {
      state.commentLoading = true;
    });
    builder.addCase(handleAddcomment.fulfilled, (state) => {
      state.commentLoading = false;
    });
    builder.addCase(handleAddcomment.rejected, (state) => {
      state.commentLoading = false;
    });
    // _______________ Post Feedback _______________
    builder.addCase(handlePostFeedback.pending, (state) => {
      state.postFeedbackLoading = true;
    });
    builder.addCase(handlePostFeedback.fulfilled, (state) => {
      state.postFeedbackLoading = false;
    });
    builder.addCase(handlePostFeedback.rejected, (state) => {
      state.postFeedbackLoading = false;
    });
  },
});

export default feedbackSlice.reducer;
