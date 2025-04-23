import React from "react";
import { Box, SimpleGrid, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useGetUserProjectsQuery } from "../../services/userApi";
// import ProjectCard, { ProjectCardProps } from "../ProjectCard";
import { TrimmedProject } from "types/project";
import ProjectCard from "components/ProjectCard";

const UserProjectsTab: React.FC = () => {
    const { data, isLoading, error } = useGetUserProjectsQuery();

    if (isLoading) {
        return (
            <Box textAlign="center" py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text mt={2} color="gray.500">Loading your projects...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="md" mt={4}>
                <AlertIcon />
                There was an error loading your projects.
            </Alert>
        );
    }

    if (!data?.projects?.length) {
        return (
            <Box textAlign="center" py={8}>
                <Text color="gray.500">You haven&apos;t created any projects yet.</Text>
            </Box>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={4}>
            {data.projects.map((project: TrimmedProject) => (
                <ProjectCard key={project._id} {...project} />
            ))}
        </SimpleGrid>
    );
};

export default UserProjectsTab;
