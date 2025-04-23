/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
    Spinner,
    useDisclosure,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import {
    FiArrowLeft,
    FiAlertTriangle,
    FiFileText,
    FiDownload,
    FiEye,
    FiCheck,
    FiX,
    FiClock,
    FiExternalLink,
    FiInfo,
    FiCalendar,
    FiUser,
    FiChevronRight
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
    useGetReportByIdQuery,
    useUpdateReportStatusMutation
} from "../../services/reportApi";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import NextLink from "next/link";
import Head from "next/head";

const ReportDetailPage = () => {
    const router = useRouter();
    const { reportId } = router.query;
    const { isLoading: authLoading, isGovernment } = useAuth();
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const { isOpen: showRejectionInput, onOpen: openRejectionInput, onClose: closeRejectionInput } = useDisclosure();

    const {
        data: report,
        isLoading,
        error,
        refetch
    } = useGetReportByIdQuery(reportId as string, {
        skip: !reportId || authLoading,
    });

    // const reportedBy = report?.reportedBy.isAnonymous ? "Anonymous Report" : `Reported by: ${report?.reportedBy.userId?.name as string}`;
    // console.log('report', report);

    const [updateStatus, { isLoading: isUpdating }] = useUpdateReportStatusMutation();

    useEffect(() => {
        if (!authLoading && !isGovernment) {
            router.replace("/dashboard");
        }
    }, [authLoading, isGovernment, router]);

    useEffect(() => {
        if (report) {
            setSelectedStatus(report.status);
        }
    }, [report]);

    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl" color="blue.500" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <button
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition"
                    onClick={() => router.back()}
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Reports
                </button>

                <Alert status="error" rounded="md">
                    <AlertIcon />
                    Failed to load report details. Please try again.
                </Alert>
            </div>
        );
    }

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-100 text-amber-800";
            case "investigating":
                return "bg-blue-100 text-blue-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <FiClock className="mr-1.5" />;
            case "investigating":
                return <FiEye className="mr-1.5" />;
            case "resolved":
                return <FiCheck className="mr-1.5" />;
            case "rejected":
                return <FiX className="mr-1.5" />;
            default:
                return null;
        }
    };

    const handleStatusChange = async (status: string) => {
        if (status === "rejected") {
            setSelectedStatus(status);
            openRejectionInput();
            return;
        }

        try {
            await updateStatus({
                reportId: report._id,
                status: status as "pending" | "investigating" | "resolved"
            }).unwrap();

            toast.success(`Report status updated to ${status}`);
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update report status");
        }
    };

    const submitRejection = async () => {
        if (rejectionReason.trim().length < 10) {
            toast.error("Please provide a reason for rejection (at least 10 characters)");
            return;
        }

        try {
            await updateStatus({
                reportId: report._id,
                status: "rejected",
                rejectionReason
            }).unwrap();

            toast.success("Report rejected successfully");
            closeRejectionInput();
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject report");
        }
    };


    // Format the correct reportedBy name
    const getReporterDisplay = () => {
        if (report.reportedBy.isAnonymous) {
            return "Anonymous Report";
        }
        if (report.reportedBy.userId) {
            return `Reported by: ${report.reportedBy.userId?.name}, UID: ${report.reportedBy.userId?._id}`;
        }
        return `Reporter ID: ${report.reportedBy.userId || "Unknown"}`;
    };

    return (
        <>
            <Head>
                <title>Report Details | ProAct</title>
            </Head>

            <div className="bg-gray-50 min-h-screen pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition"
                        onClick={() => router.back()}
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Reports
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Main Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
                                <h1 className="text-xl md:text-2xl font-bold text-white flex items-center">
                                    <FiAlertTriangle className="mr-3" />
                                    Corruption Report #{report._id.substring(0, 8)}
                                </h1>
                                <div className={`rounded-full px-3 py-1 text-sm font-medium flex items-center
                                    ${report.status === "pending" ? "bg-amber-400 text-amber-900" :
                                        report.status === "investigating" ? "bg-blue-400 text-blue-900" :
                                            report.status === "resolved" ? "bg-green-400 text-green-900" :
                                                "bg-red-400 text-red-900"}`}
                                >
                                    {getStatusIcon(report.status)}
                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                {/* Meta Information */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="mr-2" />
                                        Reported: {formatDate(report.createdAt)}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiUser className="mr-2" />
                                        {getReporterDisplay()}
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {/* Left Column - Project Info */}
                                    <div className="md:col-span-1">
                                        <div className="bg-blue-50 rounded-lg p-4 h-full">
                                            <h2 className="text-lg font-semibold mb-3 text-blue-800">Project Information</h2>
                                            {/* Fix Link with nested anchor tag */}
                                            <NextLink href={`/project/${report.project._id}`} passHref legacyBehavior>
                                                <a className="text-blue-600 hover:text-blue-800 font-semibold flex items-center mb-2 transition">
                                                    {report.project.title}
                                                    <FiExternalLink className="ml-1.5" />
                                                </a>
                                            </NextLink>
                                            <p className="text-xs text-gray-500">Project ID: {report.project._id}</p>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {report.fileType !== "none" && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                        Evidence Attached
                                                    </span>
                                                )}
                                                {report.reportedBy.isAnonymous && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Anonymous
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                    {report.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Column - Description */}
                                    <div className="md:col-span-2">
                                        <h2 className="text-lg font-semibold mb-3">Report Description</h2>
                                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner min-h-[150px] whitespace-pre-wrap">
                                            {report.description}
                                        </div>

                                        {/* AI Analysis Section */}
                                        {report.aiAnalysis && (
                                            <div className="mt-6 bg-purple-50 rounded-lg p-4">
                                                <h3 className="text-md font-semibold flex items-center text-purple-800 mb-3">
                                                    <FiInfo className="mr-2" /> AI Analysis
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="mb-2">
                                                            <span className="text-sm font-medium text-gray-600">Severity:</span>
                                                            <div className="mt-1 relative pt-1">
                                                                <div className="flex mb-2 items-center justify-between">
                                                                    <div>
                                                                        <span className={`text-xs font-semibold inline-block py-1 px-2 rounded-full
                                                                            ${report.aiAnalysis.severity > 7 ? 'text-red-600 bg-red-200' :
                                                                                report.aiAnalysis.severity > 4 ? 'text-yellow-600 bg-yellow-200' :
                                                                                    'text-green-600 bg-green-200'}`}>
                                                                            {report.aiAnalysis.severity}/10
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                    <div
                                                                        style={{ width: `${report.aiAnalysis.severity * 10}%` }}
                                                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                                                                            ${report.aiAnalysis.severity > 7 ? 'bg-red-500' :
                                                                                report.aiAnalysis.severity > 4 ? 'bg-yellow-500' :
                                                                                    'bg-green-500'}`}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm mt-3">
                                                            <span className="font-medium text-gray-600">Valid Report:</span>{' '}
                                                            <span className={report.aiAnalysis.isValidReport ? "text-green-600" : "text-red-600"}>
                                                                {report.aiAnalysis.isValidReport ? "Yes" : "No"}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        {report.aiAnalysis.tags?.length > 0 && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-600 mb-1">Tags:</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {report.aiAnalysis.tags.map(tag => (
                                                                        <span key={tag}
                                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {report.aiAnalysis.summary && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium text-gray-600">Summary:</p>
                                                        <p className="text-sm mt-1 text-gray-700">{report.aiAnalysis.summary}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Evidence Section */}
                                {report.fileUrl && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-semibold mb-3">Evidence Attachment</h2>
                                        {report.fileType === "image" ? (
                                            <div className="border border-gray-200 rounded-lg p-2 bg-white">
                                                <img
                                                    src={report.fileUrl}
                                                    alt="Evidence"
                                                    className="max-h-96 mx-auto object-contain rounded"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/images/error-image.png";
                                                    }}
                                                />
                                            </div>
                                        ) : report.fileType === "pdf" ? (
                                            <div className="flex flex-col items-center">
                                                <div className="bg-gray-100 p-6 rounded-lg mb-4 w-full max-w-md flex items-center justify-center">
                                                    <FiFileText className="w-12 h-12 text-red-500" />
                                                </div>
                                                <a
                                                    href={report.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                                >
                                                    <FiDownload className="mr-2" />
                                                    Download PDF Document
                                                </a>
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                {/* Rejection Reason */}
                                {report.status === "rejected" && report.rejectionReason && (
                                    <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                        <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
                                        <p className="text-gray-700">{report.rejectionReason}</p>
                                    </div>
                                )}

                                {/* Timeline (New Feature) */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold mb-3">Report Timeline</h2>
                                    <div className="border-l-2 border-gray-200 pl-4 ml-3 space-y-4">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] mt-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                            <div className="mb-1 text-sm font-semibold text-gray-600">Report Created</div>
                                            <div className="text-xs text-gray-500">{formatDate(report.createdAt)}</div>
                                        </div>

                                        {/* Additional timeline events would be populated here based on report history */}
                                        <div className="relative">
                                            <div className={`absolute -left-[21px] mt-1.5 w-4 h-4 rounded-full border-2 border-white
                                                ${report.status === 'investigating' ? 'bg-blue-500' :
                                                    report.status === 'resolved' ? 'bg-green-500' :
                                                        report.status === 'rejected' ? 'bg-red-500' : 'bg-gray-400'}`}>
                                            </div>
                                            <div className="mb-1 text-sm font-semibold text-gray-600">
                                                Current Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(report.updatedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-8" />

                                {/* Status Update Section */}
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Update Status</h2>

                                    {showRejectionInput ? (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Reason for rejection
                                            </label>
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="Explain why this report is being rejected..."
                                                rows={3}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={submitRejection}
                                                    disabled={isUpdating}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition"
                                                >
                                                    {isUpdating ? 'Processing...' : 'Confirm Rejection'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        closeRejectionInput();
                                                        setSelectedStatus(report.status);
                                                    }}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="col-span-2 md:col-span-1">
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => handleStatusChange(e.target.value)}
                                                    disabled={isUpdating}
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="investigating">Investigating</option>
                                                    <option value="resolved">Resolved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>

                                            <div className="col-span-2 md:col-span-3 flex items-center">
                                                <div className="flex space-x-4">
                                                    <button
                                                        onClick={() => handleStatusChange('investigating')}
                                                        disabled={isUpdating || report.status === 'investigating'}
                                                        className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-sm leading-5 font-medium rounded-md text-blue-700 bg-white hover:text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <FiEye className="mr-1.5" /> Investigate
                                                    </button>

                                                    <button
                                                        onClick={() => handleStatusChange('resolved')}
                                                        disabled={isUpdating || report.status === 'resolved'}
                                                        className="inline-flex items-center px-3 py-1.5 border border-green-700 text-sm leading-5 font-medium rounded-md text-green-700 bg-white hover:text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <FiCheck className="mr-1.5" /> Resolve
                                                    </button>

                                                    <button
                                                        onClick={() => handleStatusChange('rejected')}
                                                        disabled={isUpdating || report.status === 'rejected'}
                                                        className="inline-flex items-center px-3 py-1.5 border border-red-700 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <FiX className="mr-1.5" /> Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ReportDetailPage;
