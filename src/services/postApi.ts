import { IPost, PostPayload, PostResponse, PostDocument } from "../types";
import { getToken } from "../utils/getToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/posts`,
  }),
  endpoints: (builder) => ({
    getAllPosts: builder.query<PostResponse, void>({
      providesTags: ["Post"],
      query: () => {
        const token = getToken();
        return {
          url: `/all`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    createPost: builder.mutation<PostDocument, Partial<PostPayload>>({
      invalidatesTags: ["Post"],
      query: (body) => {
        const token = getToken();
        return {
          url: "/create",
          method: "POST",
          body,
          formData: true,
          headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    updatePost: builder.mutation<PostResponse, Partial<PostPayload>>({
      query: (body) => {
        const token = getToken();
        return {
          url: "/update",
          method: "PATCH",
          body,
          formData: true,
          headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    deletePost: builder.mutation<PostResponse, string>({
      query: (id) => {
        const token = getToken();
        return {
          url: `/delete/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    fetchPostWithPassword: builder.mutation<
      PostDocument,
      {
        postId: string;
        password: string;
      }
    >({
      query: (body) => {
        const token = getToken();
        return {
          url: "/image",
          method: "POST",
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    getSinglePost: builder.query<PostDocument, string>({
      query: (id) => {
        const token = getToken();
        return {
          url: `/get/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
  tagTypes: ["Post"],
});

export const {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetAllPostsQuery,
  useLazyGetAllPostsQuery,
  useFetchPostWithPasswordMutation,
  useGetSinglePostQuery,
  useLazyGetSinglePostQuery,
  useUpdatePostMutation,
} = postApi;
