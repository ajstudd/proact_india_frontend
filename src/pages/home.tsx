"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "components/ProjectCard";
import CreateProjectForm from "components/CreateProject";
import { useGetTrimmedProjectsQuery } from "@services";
import { FiPlus, FiLoader } from "react-icons/fi";
import RoleBasedGuard from "components/RoleBasedGuard";
import { useRBAC } from "hooks/useRBAC";
import { TrimmedProject } from "types/project";
import { Heading } from "@chakra-ui/react";

const HomePage = () => {
    const [mounted, setMounted] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { data: projects, isLoading, isError, refetch } = useGetTrimmedProjectsQuery({});
    const { hasPermission } = useRBAC();

    useEffect(() => {
        setMounted(true);
        // Refetch projects when component mounts to ensure we have the latest data
        refetch();
    }, [refetch]);

    // Hide client-side only UI until after hydration
    if (!mounted) {
        return null; // Return null on server-side to prevent hydration mismatch
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 max-w-6xl mx-auto">
            <div className=" rounded-t-lg mb-6">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <Heading as="h1" size="lg">
                        Government Projects
                    </Heading>
                </div>
            </div>

            {/* Create Project Toggle Button - Only rendered for users with appropriate permission */}
            <RoleBasedGuard
                permissions={["create:project"]}
                requireVerified={true}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="mb-6 mx-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <FiPlus /> {showCreateForm ? "Hide Form" : "Create New Project"}
                </motion.button>
            </RoleBasedGuard>

            {/* Conditionally show the create form */}
            {showCreateForm && hasPermission("create:project") && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                >
                    <CreateProjectForm onSuccess={() => {
                        setShowCreateForm(false);
                        refetch();
                    }} />
                </motion.div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                    <FiLoader className="animate-spin text-4xl text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading projects...</p>
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
                        <ProjectCard key={project._id} {...project} />
                    ))}
                </motion.div>
            )}

            {/* Empty state - Show create button only to users with permission */}
            {projects && projects.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 text-xl mb-4">No projects found</p>

                    <RoleBasedGuard permissions={["create:project"]}>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Create Your First Project
                        </button>
                    </RoleBasedGuard>
                </div>
            )}
        </div>
    );
};

export default HomePage;
