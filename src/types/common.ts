export interface ErrorResponse {
  message: string;
  code: number;
  stack?: string;
}

export interface Country {
  name: string;
  code: string;
  dial_code: string;
}
