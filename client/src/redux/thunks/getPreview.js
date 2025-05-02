import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../axios";

export const getPreview = createAsyncThunk(
  "files/getPreview",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await apiGet(`/files/preview/${fileId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
