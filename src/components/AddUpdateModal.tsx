import React, { useState, useEffect, useRef } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AddUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: string, media?: File[], keepExistingMedia?: boolean) => Promise<void>;
    initialContent?: string;
    initialMedia?: string[];
    isEditing?: boolean;
}

const AddUpdateModal: React.FC<AddUpdateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialContent = "",
    initialMedia = [],
    isEditing = false,
}) => {
    const [content, setContent] = useState(initialContent);
    const [existingMedia, setExistingMedia] = useState<string[]>(initialMedia);
    const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
    const [keepExistingMedia, setKeepExistingMedia] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track previous props values to avoid unnecessary updates
    const prevPropsRef = useRef({
        isOpen,
        initialContent,
        initialMedia: [...initialMedia]
    });

    // Fix the infinite loop by properly comparing arrays and avoiding unnecessary updates
    useEffect(() => {
        // Only update state if the modal is opening or if the initial values changed significantly
        const prevProps = prevPropsRef.current;

        // Check if initialMedia arrays are different by comparing content
        const mediaChanged =
            initialMedia.length !== prevProps.initialMedia.length ||
            initialMedia.some((url, i) => prevProps.initialMedia[i] !== url);

        if (
            (isOpen && !prevProps.isOpen) ||
            (isOpen && (
                initialContent !== prevProps.initialContent ||
                mediaChanged
            ))
        ) {
            setContent(initialContent);
            setExistingMedia([...initialMedia]); // Use spread to ensure new array reference
            setNewMediaFiles([]);
            setKeepExistingMedia(true);
        }

        // Update ref with current props, creating new array reference for initialMedia
        prevPropsRef.current = {
            isOpen,
            initialContent,
            initialMedia: [...initialMedia]
        };
    }, [isOpen, initialContent, initialMedia]); // Added initialMedia to dependencies since we have proper comparison

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit(content, newMediaFiles, keepExistingMedia);
            setContent("");
            setExistingMedia([]);
            setNewMediaFiles([]);
            setKeepExistingMedia(true);
            onClose();
        } catch (error) {
            console.error("Error submitting update:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setNewMediaFiles(prev => [...prev, ...filesArray]);
        }
        // Clear the input value so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index: number) => {
        setNewMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-xl max-w-lg w-full"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium">
                                {isEditing ? "Edit Project Update" : "Add New Project Update"}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-4">
                                <label
                                    htmlFor="content"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Update Content
                                </label>
                                <textarea
                                    id="content"
                                    rows={5}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter project update details..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Existing Media Preview */}
                            {existingMedia.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Existing Media
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {existingMedia.map((item, index) => (
                                            <div
                                                key={`existing-${index}`}
                                                className="relative group w-20 h-20 border rounded overflow-hidden"
                                            >
                                                <img
                                                    src={item}
                                                    alt={`Media ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(index)}
                                                    className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <div className="mt-2">
                                            <label className="flex items-center text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    checked={keepExistingMedia}
                                                    onChange={(e) => setKeepExistingMedia(e.target.checked)}
                                                    className="mr-2"
                                                />
                                                Keep remaining existing media
                                            </label>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* New Media Preview */}
                            {newMediaFiles.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Media
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {newMediaFiles.map((file, index) => (
                                            <div
                                                key={`new-${index}`}
                                                className="relative group w-20 h-20 border rounded overflow-hidden"
                                            >
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <span className="text-xs text-gray-500 text-center p-1 overflow-hidden">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNewImage(index)}
                                                    className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        id="media-upload"
                                    />
                                    <label
                                        htmlFor="media-upload"
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
                                    >
                                        <FiImage className="mr-1" /> Add Images
                                    </label>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                        disabled={isLoading || !content.trim()}
                                    >
                                        {isLoading
                                            ? "Submitting..."
                                            : isEditing
                                                ? "Update"
                                                : "Post Update"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddUpdateModal;
