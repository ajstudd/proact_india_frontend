import React from "react";
import { Box, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useGetUserCommentsQuery } from "../../services/userApi";
import UserCommentCard from "../UserCommentCard";
import useCurrentUser from "../../hooks/useCurrentUser";

const UserCommentsTab: React.FC = () => {
    const { userId } = useCurrentUser();
    const { data, isLoading, error } = useGetUserCommentsQuery(userId!, {
        skip: !userId,
    });

    if (isLoading) {
        return (
            <Box textAlign="center" py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text mt={2} color="gray.500">Loading your comments...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="md" mt={4}>
                <AlertIcon />
                There was an error loading your comments.
            </Alert>
        );
    }

    if (!data?.comments?.length) {
        return (
            <Box textAlign="center" py={8}>
                <Text color="gray.500">You haven&apos;t made any comments yet.</Text>
            </Box>
        );
    }

    return (
        <Box>
            {data.comments.map((comment) => (
                <UserCommentCard key={comment._id} comment={comment} />
            ))}
        </Box>
    );
};

export default UserCommentsTab;
