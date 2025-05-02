import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPut } from "../axios"; // Assuming you have an API helper for GET requests
import { generatePopup } from "@/utils/toast";
import { createFolder } from "../thunks/createFolder";
import { getPreview } from "../thunks/getPreview";

// Thunk to fetch file structure
export const getFileStructure = createAsyncThunk(
  "files/getFileStructure",
  async (_, thunkAPI) => {
    try {
      const response = await apiGet(`/files/structure`);
      return response; // Response should be the file structure data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load file structure"
      );
    }
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (id, thunkAPI) => {
    try {
      const response = await apiDelete(`/files/delete/${id}`);
      generatePopup("success", response?.message);
      return { id, message: response?.message || "Deleted successfully" };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete file"
      );
    }
  }
);

export const renameFile = createAsyncThunk(
  "files/renameFile",
  async ({ id, newName }, thunkAPI) => {
    try {
      const response = await apiPut(`/files/rename/${id}`, { newName });
      generatePopup("success", response?.message);
      return {
        id,
        newName,
        message: response?.message || "Renamed successfully",
      };
    } catch (error) {
      console.log("error", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to rename file"
      );
    }
  }
);

const filesSlice = createSlice({
  name: "files",
  initialState: {
    data: null, // To store file structure data
    loading: false,
    error: null,
    preview: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching file structure
      .addCase(getFileStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store file structure data in state
      })
      .addCase(getFileStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.data)) {
          state.data = state.data.filter(
            (item) => item.id !== action.payload.id
          );
        }
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(renameFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renameFile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store file structure data in state
      })
      .addCase(renameFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally: handle the new folder in state or just trigger refresh in UI
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.preview = null;
      })
      .addCase(getPreview.fulfilled, (state, action) => {
        state.loading = false;
        state.preview = action.payload;
      })
      .addCase(getPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch preview";
      });
  },
});

export const { resetError } = filesSlice.actions;

export default filesSlice.reducer;
