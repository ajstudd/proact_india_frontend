import { api } from "./api";

export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ url: string }, { file: File; type: "image" | "pdf" }>({
      query: ({ file, type }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/upload/${type}`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
