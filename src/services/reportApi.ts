import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../utils/authUtils";

const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export interface Report {
  _id: string;
  project: {
    _id: string;
    title: string;
  };
  description: string;
  fileUrl: string;
  fileType: "image" | "pdf" | "none";
  reportedBy: {
    userId?: {
      _id: string;
      name: string;
    } | null;
    isAnonymous: boolean;
  };
  status: "pending" | "investigating" | "resolved" | "rejected";
  aiAnalysis: {
    severity: number;
    summary: string;
    isValidReport: boolean;
    tags: string[];
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const tagTypes = [
  "Reports",
  "Auth",
  "User",
  "Projects",
  "Comments",
  "Updates",
  "Media",
] as const;

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/corruption-reports`,
    prepareHeaders: (headers) => {
      // Get a fresh token every time
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes,
  endpoints: (builder) => ({
    // Create corruption report (for both anonymous and authenticated users)
    createReport: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: {
        success: boolean;
        report: Report;
        message?: string;
      }) => {
        //send error message to be used in the UI can I define the type of the error message
        if (!response.success) {
          const errorMessage = response.message || "Failed to create report";
          throw new Error(errorMessage);
        }
        return response.report;
      },
    }),

    // Get reports for a specific project (only for project owner - contractor or government)
    getProjectReports: builder.query<Report[], string>({
      query: (projectId) => `/project/${projectId}`,
      transformResponse: (response: {
        success: boolean;
        reports: Report[];
      }) => {
        if (!response.success) {
          throw new Error("Failed to fetch project reports");
        }
        return response.reports;
      },
      providesTags: (result, error, projectId) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Reports" as const,
                id: _id,
              })),
              { type: "Reports", id: projectId },
            ]
          : [{ type: "Reports", id: projectId }],
    }),

    // Get all reports for the logged-in user's projects
    getUserProjectReports: builder.query<Report[], void>({
      query: () => `/user-projects`,
      transformResponse: (response: {
        success: boolean;
        reports: Report[];
      }) => {
        if (!response.success) {
          throw new Error("Failed to fetch user project reports");
        }
        return response.reports;
      },
      providesTags: ["Reports"],
    }),

    // Update report status (only for project owner)
    updateReportStatus: builder.mutation<
      any,
      {
        reportId: string;
        status: "pending" | "investigating" | "resolved" | "rejected";
        rejectionReason?: string;
      }
    >({
      query: ({ reportId, status, rejectionReason }) => ({
        url: `/${reportId}/status`,
        method: "PATCH",
        body: { status, rejectionReason },
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: "Reports", id: reportId },
      ],
    }),

    // Get a single report by ID
    getReportById: builder.query<Report, string>({
      query: (reportId) => `/info/${reportId}`,
      transformResponse: (response: {
        success: boolean;
        report: Report;
        message?: string;
      }) => {
        if (!response.success) {
          const errorMessage = response.message || "Failed to fetch report";
          throw new Error(errorMessage);
        }
        return response.report;
      },
      providesTags: (result, error, reportId) => [
        { type: "Reports", id: reportId },
      ],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetProjectReportsQuery,
  useGetUserProjectReportsQuery,
  useUpdateReportStatusMutation,
  useGetReportByIdQuery,
} = reportApi;

// Helper function to get auth header for custom calls if needed
export const getReportAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
