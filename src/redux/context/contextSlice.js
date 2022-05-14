import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const contextSlice = createSlice({
  name: "context",
  initialState,
  reducers: {
    initiateUserState: (state, action) => {
      state.userInfo = action.payload;
    },
    clearContext: (state) => {
      state = initialState;
    },
    triggerError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    setGlobalLoad: (state, action) => {
      state.globalLoad = action.payload;
    },
    setVisits: (state, action) => {
      state.visits = action.payload;
    },
    setPets: (state, action) => {
      state.pets = action.payload;
    },
    setCognitoUserId: (state, action) => {
      state.cogUserId = action.payload;
    }
  }
});

export const {
  initiateUserState,
  clearContext,
  triggerError,
  clearError,
  setGlobalLoad,
  setVisits,
  setCognitoUserId,
  setPets
} = contextSlice.actions;

export default contextSlice.reducer;
