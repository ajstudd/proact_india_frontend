import { configureStore } from "@reduxjs/toolkit";
// import authReducer from './authSlice';
import {
  authApi,
  mediaApi,
  userApi,
  imageApi,
  postApi,
  otpApi,
  api,
  projectApi,
  notificationsApi,
  reportApi,
} from "../services";
import userSlice from "./userSlice";
import uiSlice from "./uiSlice";
import notificationsSlice from "./notificationsSlice";
import postsSlice from "./postsSlice";
import commentsSlice from "./commentsSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [api.reducerPath]: api.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    userSlice,
    notificationsSlice,
    postsSlice,
    uiSlice,
    commentsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      mediaApi.middleware,
      api.middleware,
      userApi.middleware,
      postApi.middleware,
      imageApi.middleware,
      notificationsApi.middleware,
      projectApi.middleware,
      otpApi.middleware,
      reportApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
