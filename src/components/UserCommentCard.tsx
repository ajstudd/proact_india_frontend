import React from "react";
import { Box, HStack, Text, VStack, Badge, Flex, Icon, Link, Avatar, Heading } from "@chakra-ui/react";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { FiThumbsUp, FiThumbsDown, FiMessageSquare } from "react-icons/fi";
import { Comment } from "../types/user";
import { formatDistance } from "date-fns";
import NextLink from "next/link";

interface UserCommentCardProps {
    comment: Comment;
}

export const UserCommentCard: React.FC<UserCommentCardProps> = ({ comment }) => {
    return (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            shadow="sm"
            mb={4}
        >
            {/* Project Info - Twitter-like Header */}
            <Flex mb={3}>
                <Box
                    as="img"
                    src={comment.project.bannerUrl || "/project-placeholder.jpg"}
                    alt="Project Banner"
                    borderRadius="20% / 50%"
                    boxSize="50px"
                    objectFit="cover"
                    mr={3}
                />
                <VStack alignItems="flex-start" spacing={0.5}>
                    <NextLink href={`/projects/${comment.project._id}`} passHref>
                        <Link fontWeight="bold" fontSize="md" color="blue.600">
                            {comment.project.title}
                        </Link>
                    </NextLink>
                    <Flex alignItems="center">
                        <Icon as={FaMapMarkerAlt} color="gray.500" mr={1} fontSize="xs" />
                        <Text fontSize="sm" color="gray.600">
                            {comment.project.location?.place}
                        </Text>
                    </Flex>
                    <Flex alignItems="center">
                        <Icon as={FaBuilding} color="gray.500" mr={1} fontSize="xs" />
                        <Text fontSize="sm" color="gray.600">
                            {comment.project.government?.name || "Government"}
                        </Text>
                    </Flex>
                </VStack>
            </Flex>

            {/* Comment Content */}
            <Box
                px={3}
                py={2}
                bg="gray.50"
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor="blue.400"
                mb={3}
            >
                <Text fontSize="md" color={"gray.800"}>
                    {comment.content}
                </Text>
            </Box>

            {/* Interaction Stats */}
            <HStack spacing={4} mt={2}>
                <Flex alignItems="center">
                    <Icon as={FiThumbsUp} color="green.500" mr={1} />
                    <Text color={"gray.800"} fontSize="sm">{comment.likes?.length || 0}</Text>
                </Flex>
                <Flex alignItems="center">
                    <Icon as={FiThumbsDown} color="red.500" mr={1} />
                    <Text color={"gray.800"} fontSize="sm">{comment.dislikes?.length || 0}</Text>
                </Flex>
                <Flex alignItems="center">
                    <Icon as={FiMessageSquare} color="blue.500" mr={1} />
                    <Text color={"gray.800"} fontSize="sm">{comment.replies?.length || 0}</Text>
                </Flex>
                <Text fontSize="xs" color="gray.500" ml="auto">
                    {formatDistance(new Date(comment.createdAt), new Date(), {
                        addSuffix: true
                    })}
                </Text>
            </HStack>
        </Box>
    );
};

export default UserCommentCard;
