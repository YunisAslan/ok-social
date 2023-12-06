import { editUserRequest } from "@/services/api/users";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
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
    addNewUserPost: (state, action) => {
      state.user.posts.push(action.payload);

      localStorage.setItem("user", JSON.stringify(state.user));
    },
    updateUser: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setIsLogin, logOut, updateUser, addNewUserPost } =
  userSlice.actions;

export default userSlice.reducer;
