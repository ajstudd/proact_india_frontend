import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    useToast,
    Progress,
    Switch
} from "@chakra-ui/react";
import {
    FiAlertTriangle,
    FiUpload,
    FiSend,
    FiEye,
    FiEyeOff,
    FiFileText,
    FiImage,
    FiX,
    FiShield
} from "react-icons/fi";
import { useCreateReportMutation } from "../services/reportApi";
import { useAuth } from "../contexts/AuthContext";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectTitle: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, projectId, projectTitle }) => {
    const [description, setDescription] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const { isAuthenticated, userId } = useAuth();
    const [reportAnonymously, setReportAnonymously] = useState(!isAuthenticated);
    const [createReport, { isLoading, error }] = useCreateReportMutation();
    const toast = useToast();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setDescription("");
            setAttachment(null);
            setFileName("");
            setReportAnonymously(!isAuthenticated);
        }
    }, [isOpen, isAuthenticated]);

    // Show error toast when API returns an error
    useEffect(() => {
        if (error) {
            // Access the error message structure correctly based on RTK Query error format
            const errorMessage =
                'data' in error
                    ? (error.data as { message?: string })?.message || "Failed to submit report. Please try again."
                    : "Failed to submit report. Please try again.";

            toast({
                title: "Submission failed",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    }, [error, toast]);

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Only allow images and PDFs up to 5MB
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "File size must be less than 5MB",
                    status: "error",
                    duration: 3000,
                    isClosable: true
                });
                return;
            }

            if (!file.type.match("image/*") && !file.type.match("application/pdf")) {
                toast({
                    title: "Invalid file type",
                    description: "Only image or PDF files are allowed",
                    status: "error",
                    duration: 3000,
                    isClosable: true
                });
                return;
            }

            setAttachment(file);
            setFileName(file.name);
        }
    };

    const clearAttachment = () => {
        setAttachment(null);
        setFileName("");
    };

    const getFileIcon = (filename: string) => {
        if (filename.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
            return FiImage;
        }
        return FiFileText;
    };

    const handleSubmit = async () => {
        if (description.trim().length < 20) {
            toast({
                title: "Description required",
                description: "Please provide a detailed description (at least 20 characters)",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('projectId', projectId);
            formData.append('description', description);
            formData.append('isAnonymous', reportAnonymously.toString());

            if (isAuthenticated && userId && !reportAnonymously) {
                formData.append('userId', userId);
            }

            if (attachment) {
                formData.append('attachment', attachment);
            }

            await createReport(formData).unwrap();
            toast({
                title: "Report submitted",
                description: "Thank you for helping to combat corruption.",
                status: "success",
                duration: 5000,
                isClosable: true
            });

            // Reset form and close modal
            setDescription("");
            setAttachment(null);
            setFileName("");
            onClose();
        } catch (err) {
            // Error is handled by the useEffect above
            console.error("Error submitting corruption report:", err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered >
            <ModalOverlay className="backdrop-blur-sm bg-black/60" />
            <ModalContent className="rounded-lg overflow-hidden shadow-lg">
                <div className="bg-red-500 text-white py-3 px-4 text-lg flex items-center justify-between relative">
                    <div className="flex items-center">

                        Report Corruption
                    </div>
                    <ModalCloseButton className="text-white rounded-lg bg-gray-700 text-sm px-2 py-2 justify-end content-end items-end self-end" />
                </div>

                <div className="py-3 px-4 bg-white space-y-3">
                    {/* Compact Project Info Banner */}
                    <p className="text-sm font-medium">
                        Project: <span className="font-bold">{projectTitle}</span>
                    </p>

                    {/* Anonymous Reporting Toggle */}
                    {isAuthenticated && (
                        <div className="flex items-center justify-between px-2 py-1 border rounded-md bg-gray-50">
                            <div>
                                <label htmlFor="anonymous-report" className="flex items-center text-sm">
                                    <span className="mr-2 text-gray-600">
                                        {reportAnonymously ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                    {reportAnonymously ? "Anonymous Reporting" : "Report with Identity"}
                                </label>
                            </div>
                            <Switch
                                id="anonymous-report"
                                isChecked={reportAnonymously}
                                onChange={() => setReportAnonymously(!reportAnonymously)}
                                colorScheme="teal"
                                size="sm"
                            />
                        </div>
                    )}

                    {/* Description Field */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            <FiAlertTriangle className="inline mr-1 text-red-500" />
                            Describe the corruption issue
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What did you observe? When did it happen? Who was involved?"
                            rows={4}
                            className={`w-full p-2 rounded-md border text-sm ${description.length >= 20
                                ? "border-green-300" : "border-gray-300"} resize-none`}
                        />
                        <div className="flex justify-between mt-1 items-center">
                            <p className="text-xs text-gray-500">
                                {description.length < 20 ? `Minimum ${20 - description.length} more characters needed` : ""}
                            </p>
                            <p className={`text-xs ${description.length >= 20 ? "text-green-500" : "text-gray-500"}`}>
                                {description.length}/20
                            </p>
                        </div>
                        <Progress
                            value={Math.min(description.length / 20 * 100, 100)}
                            size="xs"
                            colorScheme={description.length >= 20 ? "green" : "gray"}
                            mt={1}
                            borderRadius="full"
                        />
                    </div>

                    {/* File Attachment */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            <FiUpload className="inline mr-1 text-gray-500" />
                            Evidence Attachment (optional)
                        </label>

                        {fileName ? (
                            <div className="rounded-md bg-gray-50 p-2 border border-gray-200 flex justify-between items-center">
                                <div className="flex items-center">
                                    {getFileIcon(fileName) === FiImage ?
                                        <FiImage className="mr-2 text-gray-500" /> :
                                        <FiFileText className="mr-2 text-gray-500" />
                                    }
                                    <p className="text-sm truncate max-w-[150px]">
                                        {fileName}
                                    </p>
                                </div>
                                <button
                                    className="text-red-500 hover:bg-gray-100 p-1 rounded-full"
                                    onClick={clearAttachment}
                                >
                                    <FiX />
                                </button>
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-300 rounded-md p-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={handleAttachmentChange}
                                    className="h-full w-full absolute top-0 left-0 opacity-0 z-10 cursor-pointer"
                                    aria-hidden="true"
                                />
                                <div className="flex items-center justify-center text-sm text-gray-500">
                                    <FiUpload className="mr-2" />
                                    Upload image/PDF (max 5MB)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center text-xs text-gray-500">
                        <FiShield className="mr-1" />
                        <p>Your report is protected and kept confidential.</p>
                    </div>
                </div>

                <div className="bg-gray-50 border-t px-4 py-3 flex justify-end">
                    <button
                        className="border border-gray-300 rounded-md mr-2 px-3 py-1 text-sm hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={description.length < 20 || isLoading}
                        className={`bg-red-500 text-white rounded-md px-4 py-1 flex items-center text-sm
                            hover:bg-red-600 transition-colors
                            ${(description.length < 20 || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit <FiSend className="ml-1" />
                            </>
                        )}
                    </button>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default ReportModal;
