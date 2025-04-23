import {
    BaseQueryFn,
    FetchArgs,
    createApi,
    fetchBaseQuery,
  } from '@reduxjs/toolkit/query/react';
  import {
    ErrorResponse,
  } from '../types';
  import {
    VerifyOtpRequestPayload,
    RequestOtpRequestPayload,
  } from '../types/auth';  
  const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  
  export const otpApi = createApi({
    reducerPath: 'otpApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${API_URL}/otp`,
    }) as BaseQueryFn<FetchArgs, unknown, { status: number; data: ErrorResponse }>,
    endpoints: (builder) => ({
      /** 🔐 User Login */
  
      /** 📩 Request OTP */
      requestOtp: builder.mutation<void, RequestOtpRequestPayload>({
        query: (body) => ({
          url: '/request',
          method: 'POST',
          body,
        }),
      }),
  
      /** ✅ Verify OTP */
      verifyOtp: builder.mutation<void, VerifyOtpRequestPayload>({
        query: (body) => ({
          url: '/verify',
          method: 'POST',
          body,
        }),
      }),
    }),
  });
  
  export const {
    useRequestOtpMutation,
    useVerifyOtpMutation,
  } = otpApi;
  