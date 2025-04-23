"use client";

import { useEffect } from "react";
import {
    Box,
    Heading,
    Text,
    Flex,
    Spinner,
    Button,
    Badge,
    Divider,
    useToast,
    IconButton,
    Avatar,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { FiCheck } from "react-icons/fi";
import useNotifications from "../hooks/useNotifications";
import DynamicLayoutHeader from "../components/DynamicLayoutHeader";

const NotificationsPage = () => {
    const toast = useToast();
    const {
        notifications,
        totalPages,
        currentPage,
        filter,
        setFilter,
        setPage,
        isLoading,
        markAllAsRead,
        unreadCount
    } = useNotifications();

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            toast({
                title: "Success",
                description: "All notifications marked as read",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark notifications as read",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const formatDate = (date: Date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const getNotificationIcon = (notification: any) => {
        return (
            <Avatar
                size="sm"
                name={notification.sender?.name || "System"}
                src={notification.sender?.photo ? `/api/user/${notification.sender._id}/avatar` : undefined}
            />
        );
    };

    return (
        <Box className="min-h-screen bg-gray-50 pb-20">
            <Box className="pt-4 px-4">
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading as="h1" size="lg">
                        Notifications
                    </Heading>

                    <Flex gap={2}>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            variant={filter === undefined ? "solid" : "outline"}
                            onClick={() => setFilter(undefined)}
                        >
                            All
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            variant={filter === "unread" ? "solid" : "outline"}
                            onClick={() => setFilter("unread")}
                        >
                            Unread
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            variant={filter === "read" ? "solid" : "outline"}
                            onClick={() => setFilter("read")}
                        >
                            Read
                        </Button>
                    </Flex>
                </Flex>

                {isLoading ? (
                    <Flex justify="center" align="center" h="200px">
                        <Spinner size="xl" color="blue.500" />
                    </Flex>
                ) : notifications?.length === 0 ? (
                    <Box p={8} textAlign="center" bg="white" borderRadius="md" shadow="sm">
                        <Text fontSize="lg" color="gray.500">
                            You have no notifications
                        </Text>
                    </Box>
                ) : (
                    <>
                        <Flex justify="flex-end" mb={2}>
                            <Button
                                size="sm"
                                leftIcon={<FiCheck />}
                                onClick={handleMarkAllAsRead}
                                isDisabled={notifications?.every(n => n.read)}
                            >
                                Mark all as read
                            </Button>
                        </Flex>

                        <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden">
                            {notifications.map((notification, index) => (
                                <Box key={notification._id}>
                                    <Box
                                        p={4}
                                        bg={notification.read ? "white" : "green.50"}
                                        transition="background-color 0.3s"
                                    >
                                        <Flex>
                                            <Box mr={3} mt={1}>
                                                {getNotificationIcon(notification)}
                                            </Box>
                                            <Box flex="1">
                                                <Text fontWeight="medium">{notification.title || notification.message}</Text>
                                                <Text color="gray.600" fontSize="sm" mt={1}>
                                                    {notification.content || notification.message}
                                                </Text>
                                                <Flex justify="space-between" mt={2}>
                                                    <Text color="gray.500" fontSize="xs">
                                                        {formatDate(notification.createdAt)}
                                                    </Text>
                                                    {!notification.read && (
                                                        <Badge colorScheme="green" fontSize="xs">
                                                            New
                                                        </Badge>
                                                    )}
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </Box>
                                    {index < notifications.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </Box>

                        {totalPages && totalPages > 1 && (
                            <Flex justify="center" mt={6} gap={2}>
                                <Button
                                    size="sm"
                                    onClick={() => setPage(currentPage - 1)}
                                    isDisabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Text alignSelf="center">
                                    Page {currentPage} of {totalPages}
                                </Text>
                                <Button
                                    size="sm"
                                    onClick={() => setPage(currentPage + 1)}
                                    isDisabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </Flex>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default NotificationsPage;
