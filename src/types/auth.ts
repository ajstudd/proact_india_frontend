export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface Role {
  id: number;
  label: string;
  scopes: string[];
}

export interface User {
  name: string;
  email: string;
  role: Role;
  id: string;
  isVerified: boolean;
}

export interface Tokens {
  access: TokenPayload;
  refresh: TokenPayload;
}

export interface UserAuthResponsePayload {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    isVerified: boolean;
  };
}

export interface UserAuthRequestPayload {
  name: string;
  email: string;
  phone: string;
  photo?: string;
  password: string;
}

// export type LoginAuthRequestPayload = Pick<
//   UserAuthRequestPayload,
//   "email" | "password"
// >;

export interface LoginAuthRequestPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginAuthResponsePayload {
  user: User;
  token: string;
}
export interface LoginSuccessResponsePayload {
  message: string;
  resp: {
    token: string;
    user: {
      id: string;
      name: string;
      email?: string;
      phone?: string;
      role: string;
      isVerified: boolean;
    };
  };
}

// {
//   "message": "Login successful!",
//   "resp": {
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjYyZjQwZDljMGM4ZTIxNTkwYjY0NyIsInJvbGUiOiJVU0VSIiwiaXNWZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzQwMjUyMjc4LCJleHAiOjE3NDI4NDQyNzh9.3GCBf4isD0PuEu0KX3Etmj-lIvIJEVbFilHkl2efnTU",
//       "user": {
//           "id": "67b62f40d9c0c8e21590b647",
//           "name": "junaid",
//           "email": "j7654894110@gmail.com",
//           "role": "USER",
//           "isVerified": true
//       }
//   }
// }

export interface VerifyOtpRequestPayload {
  otp: string;
  email?: string;
  phone?: string;
}

export interface RegisterUserRequestPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role?: "ADMIN" | "USER" | "CONTRACTOR" | "GOVERNMENT";
  governmentId?: string;
  contractorLicense?: string;
}

export interface ForgotPasswordRequestPayload {
  email: string;
}
export interface ResetPasswordRequestPayload {
  newPassword: string;
  repeatNewPassword: string;
}

export interface LoginPasswordPayload {
  email: string;
  password: string;
}
export interface LoginPasswordResponsePayload {
  token: string;
  user: {
    id: string;
    name: string;
    email?: string;
    role: string;
    isVerified: boolean;
  };
}

export interface RequestOtpRequestPayload {
  email: string;
  phone: string;
  method: string;
}

export interface AuthToken {
  id: string;
  role: string;
  isVerified: boolean;
}
