import { LocalStorageKeys } from "../configs/localStorageKeys";
import { ErrorResponse, UserAuthResponsePayload } from "../types";
// import { reAuthBaseQuery } from '@/utils/reAuth';
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/media`,
});

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery,
  endpoints: (builder) => ({
    upload: builder.mutation<{ uploadImgLoc: string }, FormData>({
      query: (body) => ({
        url: "/upload",
        method: "POST",
        body,
        // headers: {
        //   Authorization: `Bearer ${
        //     (
        //       JSON.parse(
        //         localStorage.getItem(LocalStorageKeys.AUTH_DATA)!
        //       ) as UserAuthResponsePayload
        //     ).tokens.access.token
        //   }`,
        // },
      }),
    }),
  }),
});

export const { useUploadMutation } = mediaApi;
