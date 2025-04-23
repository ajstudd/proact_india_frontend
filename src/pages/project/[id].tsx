import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { FiArrowLeft, FiMapPin, FiThumbsUp, FiThumbsDown, FiAlertCircle, FiBookmark } from "react-icons/fi";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ProjectStats from "components/ProjectStats";
import Comments from "components/Comments";
import UpdatesTimeline from "components/UpdatesTimeline";
import PdfToSlides from "components/PdfToSlides";
import MapModal from "components/MapModal";
import ProjectStakeholders from "components/ProjectStakeholders";
import ReportModal from "components/ReportModal"; // Import the new component
import RoleBasedGuard from "components/RoleBasedGuard"; // Import the guard component
import {
    useGetProjectByIdQuery,
    useLikeProjectMutation,
    useDislikeProjectMutation,
    useAddCommentMutation,
    useRemoveCommentMutation,
    useLikeCommentMutation,
    useDislikeCommentMutation,
    useAddProjectUpdateMutation,
    useEditProjectUpdateMutation,
    useRemoveProjectUpdateMutation
} from "@services";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuth } from "../../contexts/AuthContext";
import { useRBAC } from "../../hooks/useRBAC"; // Added RBAC hook
import { useBookmarks } from "../../hooks/useBookmarks"; // Import the new hook
import { toast } from "react-toastify"; // Assuming you use react-hot-toast for notifications

const ProjectPage = () => {
    const router = useRouter();
    const { id } = router.query; // Get project ID from URL
    const [projectId, setProjectId] = useState<string | null>(null);

    // Get current user using our new hook
    const { user, isAuthenticated, userId } = useCurrentUser();
    const auth = useAuth();
    const { isGovernment, isContractor } = useRBAC(); // Using RBAC hook

    // Use our new bookmark hook
    const {
        isProjectBookmarked,
        toggleBookmark,
        isBookmarking
    } = useBookmarks();

    // State for modals
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Add this state

    useEffect(() => {
        if (id) {
            setProjectId(id as string);
        }
    }, [id]);

    // Load the project and comments
    const { data: project, error, isLoading } = useGetProjectByIdQuery(projectId!, {
        skip: !projectId,
    });

    // Get mutations for interactions
    const [likeProject] = useLikeProjectMutation();
    const [dislikeProject] = useDislikeProjectMutation();
    const [addComment] = useAddCommentMutation();
    const [removeComment] = useRemoveCommentMutation();
    const [likeComment] = useLikeCommentMutation();
    const [dislikeComment] = useDislikeCommentMutation();

    // Project update mutations
    const [addProjectUpdate] = useAddProjectUpdateMutation();
    const [editProjectUpdate] = useEditProjectUpdateMutation();
    const [removeProjectUpdate] = useRemoveProjectUpdateMutation();

    // Add local state for comments to enable optimistic updates
    const [localComments, setLocalComments] = useState<any[]>([]);

    // Sync local comments with API data when it changes
    useEffect(() => {
        if (project?.comments) {
            setLocalComments(project.comments);
        }
    }, [project?.comments]);

    // Handle bookmark toggle
    const handleBookmarkToggle = async () => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to bookmark this project");
            return;
        }

        try {
            const result = await toggleBookmark(projectId);
            if (result.success) {
                const message = isProjectBookmarked(projectId)
                    ? "Project removed from bookmarks"
                    : "Project added to bookmarks";
                toast.success(message);
            } else if (result.message) {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
            toast.error("Failed to update bookmark status");
        }
    };

    // Handlers for user interactions
    const handleLike = async () => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to support this project");
            return;
        }

        try {
            await likeProject(projectId).unwrap();
            toast.success("Project supported successfully");
        } catch (error) {
            console.error("Failed to like project:", error);
            toast.error("Failed to support project");
        }
    };

    const handleDislike = async () => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to oppose this project");
            return;
        }

        try {
            await dislikeProject(projectId).unwrap();
            toast.success("Project opposed successfully");
        } catch (error) {
            console.error("Failed to dislike project:", error);
            toast.error("Failed to oppose project");
        }
    };

    const handleAddComment = useCallback(async (comment: string, parentCommentId?: string) => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to comment");
            return;
        }

        try {
            // API call first
            const response = await addComment({
                projectId,
                comment,
                parentCommentId
            }).unwrap();
            console.log('response in comment', response)

            // On successful response, update the local comments state
            if (response && response.comment) {
                setLocalComments(prevComments => {
                    // For replies, find parent comment and add the new reply
                    if (parentCommentId) {
                        return prevComments.map(c => {
                            if (c._id === parentCommentId) {
                                // Ensure replies array exists
                                const replies = Array.isArray(c.replies) ? [...c.replies] : [];
                                // Return updated comment with new reply added
                                return {
                                    ...c,
                                    replies: [...replies, response.comment]
                                };
                            }
                            return c;
                        });
                    }
                    // For top-level comments
                    return [response.comment, ...prevComments];
                });
            }

            toast.success(parentCommentId ? "Reply added successfully" : "Comment added successfully");
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast.error("Failed to add comment");
        }
    }, [projectId, isAuthenticated, addComment]);

    const handleDeleteComment = useCallback(async (commentId: string) => {
        if (!projectId) return;
        try {
            // Make actual API call
            await removeComment({ projectId, commentId }).unwrap();
            setLocalComments(prevComments => {
                // First try to delete from top level comments
                const topLevelFiltered = prevComments.filter(c => c._id !== commentId);

                if (topLevelFiltered.length < prevComments.length) {
                    return topLevelFiltered;
                }

                // If not found at top level, search in replies
                return prevComments.map(c => ({
                    ...c,
                    replies: (c.replies || []).filter((r: any) => r?._id !== commentId)
                }));
            });
            toast.success("Comment deleted successfully");
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error("Failed to delete comment");

            // Revert optimistic update if there's an error
            if (project?.comments) {
                setLocalComments(project.comments);
            }
        }
    }, [projectId, removeComment, project?.comments]);

    const handleLikeComment = useCallback(async (commentId: string) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to like comments");
            return;
        }

        try {
            // API call - local state is handled by the Comments component now
            await likeComment({ projectId, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to like comment:", error);
            toast.error("Failed to like comment");
        }
    }, [projectId, isAuthenticated, likeComment]);

    const handleDislikeComment = useCallback(async (commentId: string) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to dislike comments");
            return;
        }

        try {
            // API call - local state is handled by the Comments component now
            await dislikeComment({ projectId, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to dislike comment:", error);
            toast.error("Failed to dislike comment");
        }
    }, [projectId, isAuthenticated, dislikeComment]);

    // Determine if the current user can manage this project
    const canManageProject = isAuthenticated &&
        ((isGovernment && project?.government?._id === userId) ||
            (isContractor && project?.contractor?._id === userId));

    // Project update handlers - Updated to handle file uploads
    const handleAddUpdate = async (content: string, mediaFiles?: File[]) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to add updates");
            return;
        }

        try {
            await addProjectUpdate({
                projectId,
                content,
                media: mediaFiles
            }).unwrap();
            toast.success("Project update added successfully");
        } catch (error) {
            console.error("Failed to add update:", error);
            toast.error("Failed to add update");
        }
    };

    const handleEditUpdate = async (updateId: string, content: string, mediaFiles?: File[], keepExistingMedia: boolean = true) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to edit updates");
            return;
        }

        try {
            await editProjectUpdate({
                projectId,
                updateId,
                content,
                media: mediaFiles,
                keepExistingMedia
            }).unwrap();
            toast.success("Project update edited successfully");
        } catch (error) {
            console.error("Failed to edit update:", error);
            toast.error("Failed to edit update");
        }
    };

    const handleDeleteUpdate = async (updateId: string) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to delete updates");
            return;
        }

        try {
            await removeProjectUpdate({
                projectId,
                updateId
            }).unwrap();
            toast.success("Project update removed successfully");
        } catch (error) {
            console.error("Failed to delete update:", error);
            toast.error("Failed to delete update");
        }
    };

    if (isLoading) return <p className="text-center text-gray-500 mt-20">Loading...</p>;
    if (error) return <p className="text-center text-gray-500 mt-20">Error loading project data.</p>;
    if (!project) return <p className="text-center text-gray-500 mt-20">Project not found.</p>;

    // Check if user has liked or disliked the project
    const userHasLiked = isAuthenticated && project.likes?.includes(userId || '');
    const userHasDisliked = isAuthenticated && project.dislikes?.includes(userId || '');

    // Check if project is bookmarked
    const projectIsBookmarked = isAuthenticated && projectId ? isProjectBookmarked(projectId) : false;

    // Using RBAC approach for checking update management permissions
    const canManageUpdates = isAuthenticated &&
        ((isGovernment && project.government?._id === userId) ||
            (isContractor && project.contractor?._id === userId));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-100 p-6"
        >
            <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <FiArrowLeft /> <span>Back to Projects</span>
            </button>

            <div className="relative bg-white p-6 rounded-lg shadow-lg mt-4">
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleBookmarkToggle}
                        disabled={isBookmarking}
                        className={`p-2 rounded-full ${projectIsBookmarked
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            } transition-colors`}
                        aria-label={projectIsBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                        <FiBookmark
                            className={`${projectIsBookmarked ? 'fill-current' : ''}`}
                            size={20}
                        />
                    </button>
                </div>
                <img src={project.bannerUrl} alt={project.title} className="w-full h-64 object-cover rounded-lg" />
                <h1 className="text-3xl font-bold text-gray-900 mt-4">{project.title}</h1>
                <p className="text-gray-700 mt-2">{project.description}</p>
                <div className="flex items-center justify-between mt-4 text-gray-700">
                    <div className="flex items-center">
                        <FiMapPin className="mr-1 text-red-500" />
                        {project.location.place}
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                            <FiThumbsUp className="mr-1 text-green-500" /> {project.likes.length}
                        </span>
                        <span className="flex items-center">
                            <FiThumbsDown className="mr-1 text-red-500" /> {project.dislikes.length}
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsPdfOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        View Project PDF
                    </button>
                    <button
                        onClick={() => setIsMapOpen(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        View Map Location
                    </button>
                    {/* Report corruption button always available to all users */}
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center"
                    >
                        <FiAlertCircle className="mr-2" /> Report Corruption
                    </button>
                </div>
            </div>

            <ProjectStakeholders
                contractor={project.contractor}
                government={project.government}
            />

            <ProjectStats
                budget={project.budget}
                expenditure={project.expenditure}
                likesCount={project.likes.length}
                dislikesCount={project.dislikes.length}
                createdAt={project.createdAt}
                onLike={handleLike}
                onDislike={handleDislike}
                userHasLiked={userHasLiked}
                userHasDisliked={userHasDisliked}
                isAuthenticated={isAuthenticated} // Pass authentication status
                projectId={project._id} // Pass projectId
                canManageProject={canManageProject} // Pass management permissions
            />

            <UpdatesTimeline
                updates={project.updates || []}
                projectId={project._id}
                onAddUpdate={handleAddUpdate}
                onEditUpdate={handleEditUpdate}
                onDeleteUpdate={handleDeleteUpdate}
                canManageUpdates={canManageUpdates}
                isAuthenticated={isAuthenticated} // Pass authentication status
            />

            <Comments
                projectId={project._id}
                comments={project.comments || []}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onDislikeComment={handleDislikeComment}
                onDeleteComment={handleDeleteComment}
                currentUserId={userId || undefined}
                isAuthenticated={isAuthenticated} // Pass authentication status explicitly
            />

            <PdfToSlides pdfUrl={project.pdfUrl} isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} />
            <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} location={project.location} />

            {/* Report corruption modal - available to all users */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                style={{ display: isReportModalOpen ? "flex" : "none" }}
            >
                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    projectId={project._id}
                    projectTitle={project.title}
                />
            </div>
        </motion.div>
    );
};

export default ProjectPage;
