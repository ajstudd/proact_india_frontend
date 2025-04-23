import React from "react";
import { Box, SimpleGrid, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useGetBookmarkedProjectsQuery } from "../../services/userApi";
import BookmarkedProjectCard from "../BookmarkedProjectCard";
import { BookmarkedProject } from "../../types/project";

const BookmarkedProjectsTab: React.FC = () => {
    const { data, isLoading, error, refetch } = useGetBookmarkedProjectsQuery();

    if (isLoading) {
        return (
            <Box textAlign="center" py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text mt={2} color="gray.500">Loading your bookmarked projects...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="md" mt={4}>
                <AlertIcon />
                There was an error loading your bookmarks.
            </Alert>
        );
    }

    if (!data?.bookmarks?.length) {
        return (
            <Box textAlign="center" py={8}>
                <Text color="gray.500">You haven&apos;t bookmarked any projects yet.</Text>
            </Box>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={4}>
            {data.bookmarks.map((project: BookmarkedProject) => (
                <BookmarkedProjectCard
                    key={project._id}
                    project={project}
                    onBookmarkRemoved={refetch}
                />
            ))}
        </SimpleGrid>
    );
};

export default BookmarkedProjectsTab;
