// import { LocalStorageKeys } from '@/configs/localStorageKeys';
// import { UserAuthResponsePayload } from '@/types';
// import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
// import jwtDecode from 'jwt-decode';
// import { transformAuthResponse } from './transformTokens';

// const API_URL: string = import.meta.env.VITE_API_URL;

// const newAccessToken = async (refreshToken: string) => {
//   try {
//     const res = await fetch(`${API_URL}/auth/refresh-tokens`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ refreshToken }),
//     });

//     if (!res.ok) {
//       throw new Error('Error refreshing access token');
//     }

//     const data = await res.json();
//     const resp = transformAuthResponse(data);

//     localStorage.setItem(LocalStorageKeys.AUTH_DATA, JSON.stringify(resp));

//     return resp.tokens.access.token;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const reAuthBaseQuery =
//   (baseQuery: BaseQueryFn) =>
//   async (args: any, api: any, extraOptions: any) => {
//     const tokens = (
//       JSON.parse(
//         localStorage.getItem(LocalStorageKeys.AUTH_DATA) ?? '{}'
//       ) as UserAuthResponsePayload
//     )?.tokens;

//     if (!tokens) {
//       return await baseQuery(args, api, extraOptions);
//     }
//     const { access, refresh } = tokens;
//     const decodedAccessToken = jwtDecode<{ exp: number }>(access.token);
//     const decodedRefreshToken = jwtDecode<{ exp: number }>(refresh.token);
//     const currentTime = Date.now() / 1000;

//     if (decodedAccessToken.exp < currentTime) {
//       if (decodedRefreshToken.exp < currentTime) {
//         // refresh token is expired
//         console.log('refresh token is expired');
//         if (!extraOptions?.looseCheck) {
//           window.location.href = '/login';
//         }
//         return await baseQuery(args, api, extraOptions);
//       }

//       // refresh token is not expired
//       // get new access token
//       const accessToken = await newAccessToken(refresh.token);

//       if (!accessToken) {
//         // refresh token is expired
//         console.log('refresh token is invalid');
//         if (!extraOptions?.looseCheck) {
//           window.location.href = '/login';
//         }

//         return await baseQuery(args, api, extraOptions);
//         // return await baseQuery(args, api, extraOptions);
//       }

//       args.headers = {
//         ...args.headers,
//         Authorization: `Bearer ${accessToken}`,
//       };

//       return await baseQuery(args, api, extraOptions);
//     }

//     return await baseQuery(args, api, extraOptions);
//   };
