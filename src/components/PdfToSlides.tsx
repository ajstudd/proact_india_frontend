import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize, FiDownload, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfToSlidesProps {
    pdfUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export const PdfToSlides: React.FC<PdfToSlidesProps> = ({ pdfUrl, isOpen, onClose }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(1.0);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        if (!numPages || isPageLoading) return;
        const newPageNumber = pageNumber + offset;
        if (newPageNumber >= 1 && newPageNumber <= numPages) {
            setIsPageLoading(true);
            setPageNumber(newPageNumber);
        }
    }

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current?.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
    };

    const downloadPdf = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'document.pdf';
        link.click();
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        ref={containerRef}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-gray-800 rounded-lg p-4 w-full max-w-4xl relative"
                    >
                        <div className="flex justify-between items-center mb-4 text-white">
                            <h3 className="text-xl font-semibold">Project Documentation</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={zoomIn}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <FiZoomIn />
                                </button>
                                <button
                                    onClick={zoomOut}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <FiZoomOut />
                                </button>
                                <button
                                    onClick={downloadPdf}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <FiDownload />
                                </button>
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <FiMaximize />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center bg-white p-4 rounded-md shadow-inner relative">
                            {isPageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="max-h-[70vh] overflow-y-auto"
                                loading={<p className="text-center text-gray-500 py-10">Loading PDF document...</p>}
                                error={<p className="text-center text-red-500 py-10">Error loading PDF document.</p>}
                            >
                                <Page
                                    key={`page_${pageNumber}`}
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="shadow-lg"
                                    onLoadSuccess={() => setIsPageLoading(false)}
                                    onRenderError={() => setIsPageLoading(false)}
                                />
                            </Document>
                        </div>

                        <div className="flex items-center justify-between mt-4 text-white">
                            <button
                                onClick={() => changePage(-1)}
                                disabled={pageNumber <= 1 || isPageLoading}
                                className={`px-4 py-2 rounded-lg ${pageNumber <= 1 || isPageLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-700 transition-colors"
                                    }`}
                            >
                                <div className="flex items-center space-x-1">
                                    <FiChevronLeft />
                                    <span>Previous</span>
                                </div>
                            </button>
                            <p className="text-center">
                                Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                            </p>
                            <button
                                onClick={() => changePage(1)}
                                disabled={(numPages !== null && pageNumber >= numPages) || isPageLoading}
                                className={`px-4 py-2 rounded-lg ${(numPages !== null && pageNumber >= numPages) || isPageLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-700 transition-colors"
                                    }`}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Next</span>
                                    <FiChevronRight />
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PdfToSlides;