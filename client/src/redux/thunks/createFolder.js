import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "../axios";

// Thunk to create a folder
export const createFolder = createAsyncThunk(
  "files/createFolder",
  async ({ name, parentId = null }, thunkAPI) => {
    try {
      const payload = parentId ? { name, parentId } : { name };
      const response = await apiPost("files/create-folder", payload);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create folder"
      );
    }
  }
);
