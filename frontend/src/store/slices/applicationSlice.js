import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const createApplication = createAsyncThunk(
  'applications/create',
  async (applicationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/emails/applications`,
        applicationData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getApplications = createAsyncThunk(
  'applications/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/emails/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getApplication = createAsyncThunk(
  'applications/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/emails/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateApplication = createAsyncThunk(
  'applications/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/emails/applications/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markAsSent = createAsyncThunk(
  'applications/markAsSent',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/emails/applications/${id}/send`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const archiveApplication = createAsyncThunk(
  'applications/archive',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/emails/applications/${id}/archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  remainingCredits: null
};

// Slice
const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.jobApplication);
        state.remainingCredits = action.payload.remainingCredits;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create application';
      })
      // Get Applications
      .addCase(getApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch applications';
      })
      // Get Single Application
      .addCase(getApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.application;
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch application';
      })
      // Update Application
      .addCase(updateApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(
          app => app._id === action.payload.application._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
        if (state.currentApplication?._id === action.payload.application._id) {
          state.currentApplication = action.payload.application;
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update application';
      })
      // Mark as Sent
      .addCase(markAsSent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsSent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(
          app => app._id === action.payload.application._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
        if (state.currentApplication?._id === action.payload.application._id) {
          state.currentApplication = action.payload.application;
        }
      })
      .addCase(markAsSent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to mark application as sent';
      })
      // Archive Application
      .addCase(archiveApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(
          app => app._id === action.payload.application._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
        if (state.currentApplication?._id === action.payload.application._id) {
          state.currentApplication = null;
        }
      })
      .addCase(archiveApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to archive application';
      });
  }
});

export const { clearError, clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer; 