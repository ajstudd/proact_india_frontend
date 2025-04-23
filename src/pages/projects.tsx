"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "components/ProjectCard";
import { useGetTrimmedProjectsQuery, useDeleteProjectMutation } from "@services";
import { FiLoader, FiPlus } from "react-icons/fi";
import { useCurrentUser } from "hooks/useCurrentUser";
import { TrimmedProject } from "types/project";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Dialog } from "../components/Dialog"; // Updated import to use our custom Dialog
import { Heading } from "@chakra-ui/react";

const ProjectsPage = () => {
    const [mounted, setMounted] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const { user } = useCurrentUser();

    // Get user's projects using the userId parameter
    const {
        data: projects,
        isLoading,
        isError,
        refetch
    } = useGetTrimmedProjectsQuery({ userId: user?.id });

    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        refetch();
    }, [refetch]);

    // Hide client-side only UI until after hydration
    if (!mounted) {
        return null;
    }

    const handleCreateProject = () => {
        router.push("/home");
    };

    const handleDeleteClick = (projectId: string) => {
        setProjectToDelete(projectId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            await deleteProject(projectToDelete).unwrap();
            toast.success("Project deleted successfully");
            setDeleteModalOpen(false);
            refetch();
        } catch (error) {
            toast.error("Failed to delete the project");
            console.error("Delete project error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 max-w-6xl mx-auto">
            <div className=" rounded-t-lg mb-6">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <Heading as="h1" size="lg">
                        My Projects
                    </Heading>
                </div>
            </div>

            {/* Create Project Button */}
            {user && (user.isAuthenticated && user.role === "GOVERNMENT") && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateProject}
                    className="mb-6 mx-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <FiPlus /> Create New Project
                </motion.button>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                    <FiLoader className="animate-spin text-4xl text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading your projects...</p>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                    <p>Failed to load projects. Please try again later.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-2 text-red-700 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Projects grid */}
            {projects && projects.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {projects.map((project: TrimmedProject) => (
                        <ProjectCard
                            key={project._id}
                            {...project}
                            showActions={true}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </motion.div>
            )}

            {/* Empty state */}
            {projects && projects.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 text-xl mb-4">You haven&apos;t created any projects yet</p>

                    {user && (user.isAuthenticated || user.role === "GOVERNMENT") && (
                        <button
                            onClick={handleCreateProject}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Create Your First Project
                        </button>
                    )}

                    {!(user && (user.isAuthenticated || user.role === "GOVERNMENT")) && (
                        <p className="text-sm text-gray-500">
                            Only administrators and government officials can create projects.
                        </p>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Dialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Delete Project</Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-gray-500">
                            Are you sure you want to delete this project? This action cannot be undone.
                        </Dialog.Description>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default ProjectsPage;
