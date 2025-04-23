// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { LocalStorageKeys } from '@/configs/localStorageKeys';
// import { authApi } from '@/services/authApi';
// import { UserAuthResponsePayload } from '@/types';
// import { Tokens } from '@/types/auth';
// import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// interface AuthState extends UserAuthResponsePayload {
//   initialized: boolean;
// }

// const authSlice = createSlice<
//   AuthState,
//   {
//     setAuthData: (
//       state: AuthState,
//       action: PayloadAction<UserAuthResponsePayload>
//     ) => void;
//     setInitialized: (state: AuthState, action: PayloadAction<boolean>) => void;
//   }
// >({
//   name: 'auth',
//   initialState: {
//     user: {
//       id: '',
//       email: '',
//       name: '',
//       role: {
//         id: 1,
//         label: 'user',
//         scopes: [],
//       },
//       subscription: 'free',
//     },
//     tokens: {
//       access: {
//         token: '',
//         expires: new Date(),
//       },
//       refresh: {
//         token: '',
//         expires: new Date(),
//       },
//     },
//     initialized: false,
//   },
//   reducers: {
//     setAuthData: (
//       state: AuthState,
//       action: PayloadAction<UserAuthResponsePayload>
//     ) => {
//       state.user = action.payload.user;
//       state.tokens = action.payload.tokens;
//     },

//     setInitialized: (state: AuthState, action: PayloadAction<boolean>) => {
//       state.initialized = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     builder.addMatcher(
//       authApi.endpoints.login.matchFulfilled,
//       (state, action) => {
//         state.user = action.payload.user;
//         state.tokens = action.payload.tokens;
//         localStorage.setItem(
//           LocalStorageKeys.AUTH_DATA,
//           JSON.stringify(action.payload)
//         );
//       }
//     );

//     builder.addMatcher(
//       authApi.endpoints.register.matchFulfilled,
//       (state, action) => {
//         state.user = action.payload.user;
//         state.tokens = action.payload.tokens;
//         localStorage.setItem(
//           LocalStorageKeys.AUTH_DATA,
//           JSON.stringify(action.payload)
//         );
//       }
//     );

//     builder.addMatcher(
//       authApi.endpoints.newAccessToken.matchFulfilled,
//       (state, action) => {
//         state.tokens = action.payload.tokens;
//         localStorage.setItem(
//           LocalStorageKeys.AUTH_DATA,
//           JSON.stringify({
//             user: state.user,
//             tokens: action.payload,
//           })
//         );
//       }
//     );

//     builder.addMatcher(
//       authApi.endpoints.logout.matchFulfilled,
//       (state, _action) => {
//         state.user = {
//           id: '',
//           email: '',
//           name: '',
//           role: {
//             id: 1,
//             label: '',
//             scopes: [],
//           },
//           subscription: 'free',
//         };
//         state.tokens = {
//           access: {
//             token: '',
//             expires: new Date(),
//           },
//           refresh: {
//             token: '',
//             expires: new Date(),
//           },
//         };
//         localStorage.removeItem(LocalStorageKeys.AUTH_DATA);
//       }
//     );

//     builder.addMatcher(
//       authApi.endpoints.logout.matchRejected,
//       (state, _action) => {
//         state.user = {
//           id: '',
//           email: '',
//           name: '',
//           role: {
//             id: 1,
//             label: '',
//             scopes: [],
//           },
//           subscription: 'free',
//         };
//         state.tokens = {
//           access: {
//             token: '',
//             expires: new Date(),
//           },
//           refresh: {
//             token: '',
//             expires: new Date(),
//           },
//         };
//         localStorage.removeItem(LocalStorageKeys.AUTH_DATA);
//       }
//     );
//   },
// });

// export const { setAuthData } = authSlice.actions;

// export default authSlice.reducer;
