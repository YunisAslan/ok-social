import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  return JSON.parse(localStorage.getItem("user")) || null;
};

const initialState = {
  user: getInitialUser(),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logOut: (state, action) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setIsLogin, logOut, updateUser } = userSlice.actions;

export default userSlice.reducer;
