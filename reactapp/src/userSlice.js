import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  userName: null,
  role: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.userName = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
