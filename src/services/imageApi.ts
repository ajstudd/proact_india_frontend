import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ImageResponse } from '@types';
import FormData from 'form-data';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/image`,
  }),
  endpoints: builder => ({
    saveImage: builder.mutation<ImageResponse, FormData>({
      query: body => ({
        url: `/save`,
        method: 'POST',
        body,
        formData: true,
        headers: {
          ContentType: 'multipart/form-data',
        },
      }),
    }),
  }),
});

export const { useSaveImageMutation } = imageApi;
