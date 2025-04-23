import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetUserProjectReportsQuery } from "../services/reportApi";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiSearch, FiFilter, FiAlertTriangle, FiFileText,
    FiChevronRight, FiClock, FiCheckCircle, FiXCircle,
    FiEye, FiDownload, FiPieChart, FiRefreshCw
} from "react-icons/fi";

const ReportsPage = () => {
    const router = useRouter();
    const { isLoading: authLoading, isGovernment } = useAuth();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showStats, setShowStats] = useState(true);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Redirect non-government users
    useEffect(() => {
        if (!authLoading && !isGovernment) {
            router.replace("/dashboard");
        }
    }, [authLoading, isGovernment, router]);

    // Fetch reports for government user's projects
    const {
        data: reports = [],
        error,
        isLoading: isLoadingReports,
        refetch
    } = useGetUserProjectReportsQuery(undefined, {
        skip: !isGovernment || authLoading,
        refetchOnMountOrArgChange: true
    });

    // Filter and search reports
    const filteredReports = reports.filter((report) => {
        const matchesStatus = filter === "all" || report.status === filter;
        const matchesSearch =
            searchTerm === "" ||
            report.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Sort reports by status priority and date
    const sortedReports = [...filteredReports].sort((a, b) => {
        const statusPriority = {
            pending: 0,
            investigating: 1,
            resolved: 2,
            rejected: 3,
        };

        if (statusPriority[a.status] !== statusPriority[b.status]) {
            return statusPriority[a.status] - statusPriority[b.status];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Calculate report statistics
    const reportStats = {
        total: reports.length,
        pending: reports.filter(r => r.status === "pending").length,
        investigating: reports.filter(r => r.status === "investigating").length,
        resolved: reports.filter(r => r.status === "resolved").length,
        rejected: reports.filter(r => r.status === "rejected").length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
            case "investigating": return "bg-blue-100 text-blue-800 border-blue-200";
            case "resolved": return "bg-green-100 text-green-800 border-green-200";
            case "rejected": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusBorder = (status: string) => {
        switch (status) {
            case "pending": return "border-l-amber-500";
            case "investigating": return "border-l-blue-500";
            case "resolved": return "border-l-green-500";
            case "rejected": return "border-l-red-500";
            default: return "border-l-gray-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <FiClock className="inline" />;
            case "investigating":
                return <FiEye className="inline" />;
            case "resolved":
                return <FiCheckCircle className="inline" />;
            case "rejected":
                return <FiXCircle className="inline" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Improved export function
    const exportReports = (format: string) => {
        try {
            // Close the dropdown after selection
            setShowExportMenu(false);

            // In a real implementation, this would create the proper file format
            const exportData = sortedReports.map(report => ({
                project: report.project.title,
                description: report.description,
                status: report.status,
                date: new Date(report.createdAt).toLocaleString(),
                reportType: report.fileType
            }));

            console.log(`Exporting ${exportData.length} reports as ${format}`);
            alert(`Exporting ${exportData.length} reports as ${format}... This would download a file in a real implementation.`);
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to export reports. Please try again.");
        }
    };

    // Function to handle refresh with loading state
    const handleRefresh = () => {
        refetch()
            .then(() => console.log("Reports refreshed successfully"))
            .catch(err => console.error("Error refreshing reports:", err));
    };

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowExportMenu(false);
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isGovernment) {
        return null; // Will be redirected by the useEffect
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-gray-800">
                    <FiAlertTriangle className="text-red-500" />
                    <span>Corruption Reports</span>
                </h1>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 text-gray-700"
                    >
                        <FiRefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </button>

                    <div className="relative inline-block text-left">
                        {/* Will be enabled in future */}
                        {/* <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowExportMenu(!showExportMenu);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 text-gray-700"
                        >
                            <FiDownload className="mr-2 h-4 w-4" />
                            Export
                            <FiChevronRight className="ml-1 h-4 w-4 transform rotate-90" />
                        </button> */}
                        {showExportMenu && (
                            <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <button onClick={(e) => { e.stopPropagation(); exportReports('csv'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        Export as CSV
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); exportReports('pdf'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        Export as PDF
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); exportReports('excel'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        Export as Excel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 text-gray-700"
                    >
                        <FiPieChart className="mr-2 h-4 w-4" />
                        {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            {showStats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 border-t-4 border-t-blue-500">
                        <div className="text-sm text-gray-500 mb-1">Total Reports</div>
                        <div className="text-2xl font-bold">{reportStats.total}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-t-4 border-t-amber-500">
                        <div className="text-sm text-gray-500 mb-1">Pending</div>
                        <div className="text-2xl font-bold">{reportStats.pending}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-t-4 border-t-blue-500">
                        <div className="text-sm text-gray-500 mb-1">Investigating</div>
                        <div className="text-2xl font-bold">{reportStats.investigating}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-t-4 border-t-green-500">
                        <div className="text-sm text-gray-500 mb-1">Resolved</div>
                        <div className="text-2xl font-bold">{reportStats.resolved}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-t-4 border-t-red-500">
                        <div className="text-sm text-gray-500 mb-1">Rejected</div>
                        <div className="text-2xl font-bold">{reportStats.rejected}</div>
                    </div>
                </div>
            )}

            {/* Search and Filter Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <FiFilter className="text-gray-600" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block w-full py-2 pl-3 pr-10 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="all">All Reports</option>
                            <option value="pending">Pending</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            {isLoadingReports ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-5 w-full animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/12"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4 flex items-center">
                    <FiAlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                    <div>
                        <span className="font-medium">Failed to load reports. Please try again.</span>
                        <button
                            onClick={handleRefresh}
                            className="ml-4 bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            ) : sortedReports.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                    <FiSearch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium">
                        {searchTerm || filter !== "all"
                            ? "No reports match your search criteria."
                            : "No corruption reports found. This is a good sign!"}
                    </p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    {sortedReports.map((report, index) => (
                        <motion.div
                            key={report._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => router.push(`/report/${report._id}`)}
                        >
                            <div
                                className={`bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 ${getStatusBorder(report.status)}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)} mb-2`}>
                                            {getStatusIcon(report.status)}
                                            <span className="ml-1">{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">{report.project.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{report.description}</p>

                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                            {report.reportedBy.isAnonymous ?
                                                <span>Anonymous report</span> :
                                                <span>{report.reportedBy.userId ? "Named report" : "Anonymous report"}</span>
                                            }
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end space-y-2">
                                        <time dateTime={report.createdAt} className="text-sm text-gray-500">
                                            {formatDate(report.createdAt)}
                                        </time>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.fileType !== "none" ? "bg-teal-100 text-teal-800 border border-teal-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}>
                                            {report.fileType !== "none" ? (
                                                <>
                                                    <FiFileText className="mr-1" />
                                                    {report.fileType}
                                                </>
                                            ) : (
                                                "No attachment"
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
                                        View Details
                                        <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default ReportsPage;
