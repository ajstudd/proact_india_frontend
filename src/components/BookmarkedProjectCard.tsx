"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiDollarSign, FiCalendar, FiUsers, FiBookmark } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useRemoveBookmarkMutation } from "../services/userApi";
import { BookmarkedProject } from "../types/project";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BookmarkedProjectCardProps {
    project: BookmarkedProject;
    onBookmarkRemoved?: () => void;
}

const BookmarkedProjectCard = ({ project, onBookmarkRemoved }: BookmarkedProjectCardProps) => {
    const { _id, title, description, bannerUrl, location, budget, createdAt, contractor, government } = project;
    const router = useRouter();
    const [isRemoving, setIsRemoving] = useState(false);
    const [removeBookmark] = useRemoveBookmarkMutation();

    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown date';
    const formattedBudget = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(budget);

    const handleClick = () => {
        router.push(`/project/${_id}`);
    };

    const handleRemoveBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigating to project details

        try {
            setIsRemoving(true);
            await removeBookmark(_id).unwrap();
            toast.success("Project removed from bookmarks");
            if (onBookmarkRemoved) {
                onBookmarkRemoved();
            }
        } catch (error) {
            toast.error("Failed to remove bookmark");
        } finally {
            setIsRemoving(false);
        }
    };

    const placeholderImage = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=0x200?text=No+Image";

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all relative"
            onClick={handleClick}
        >
            <div className="absolute top-2 right-2 z-10">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveBookmark}
                    disabled={isRemoving}
                    className="bg-white/80 backdrop-blur-sm hover:bg-red-50 p-2 rounded-full shadow-md"
                    title="Remove bookmark"
                >
                    <FiBookmark className={`${isRemoving ? 'text-gray-400' : 'text-red-500'}`} />
                </motion.button>
            </div>

            <div className="relative">
                <div className="h-48 overflow-hidden">
                    <img
                        src={bannerUrl || placeholderImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                </div>
                <div className={`absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {formattedBudget}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
                {description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>}

                <div className="flex flex-wrap justify-between items-center text-sm text-gray-700">
                    {location?.place && (
                        <div className="flex items-center mb-2">
                            <FiMapPin className="mr-1 text-red-500" />
                            <span className="line-clamp-1">{location.place}</span>
                        </div>
                    )}

                    <div className="flex items-center mb-2">
                        <FiCalendar className="mr-1 text-blue-500" />
                        {formattedDate}
                    </div>
                </div>

                {/* Stakeholder information */}
                {(contractor || government) && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-3 text-xs text-gray-600">
                        {contractor && (
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded">
                                <FiUsers className="mr-1 text-amber-600" />
                                <span className="line-clamp-1">{contractor.name}</span>
                            </div>
                        )}
                        {government && (
                            <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                                <MdAccountBalance className="mr-1 text-blue-600" />
                                <span className="line-clamp-1">{government.name}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        View Details
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default BookmarkedProjectCard;
