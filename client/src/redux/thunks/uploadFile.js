// In your redux/actions or slices/filesSlice.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUploadFile } from "../axios";

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async ({ file, id }, thunkAPI) => {
    try {
      const response = await apiUploadFile(file, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "File upload failed"
      );
    }
  }
);
