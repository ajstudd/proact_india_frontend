import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  UserAuthResponsePayload,
  RegisterUserRequestPayload,
  LoginAuthRequestPayload,
  ErrorResponse,
  IUserData,
} from "../types";
import {
  LoginPasswordPayload,
  LoginPasswordResponsePayload,
  LoginSuccessResponsePayload,
} from "../types/auth";
import { clearAuthData } from "../utils/authUtils";

const API_URL: string | undefined = process.env["NEXT_PUBLIC_API_URL"];
//add env.local file in root folder and add NEXT_PUBLIC_API_URL=your api url

// Helper function to save auth data to localStorage
const saveAuthDataToLocalStorage = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authData", JSON.stringify(data.resp));
  }
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/auth`,
  }) as BaseQueryFn<
    FetchArgs,
    unknown,
    { status: number; data: ErrorResponse }
  >,
  endpoints: (builder) => ({
    /** 🔐 User Login */
    login: builder.mutation<
      LoginSuccessResponsePayload,
      LoginAuthRequestPayload
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      // Store auth data in localStorage on successful login
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const result = await queryFulfilled;
          saveAuthDataToLocalStorage(result.data);
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    /** 📝 Register User */
    register: builder.mutation<void, RegisterUserRequestPayload>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    /** 🔑 Forgot Password */
    forgotPassword: builder.mutation<void, string>({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    /** 👤 Get User Info */
    me: builder.query<
      {
        user: IUserData;
      },
      string
    >({
      query: (token) => ({
        url: "/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    /** 🚪 Logout */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // Clear auth data from localStorage on logout
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          await queryFulfilled;
          clearAuthData();
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
