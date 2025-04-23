"use client";

import { Box, Icon, Flex, Text, Badge } from "@chakra-ui/react";
import { FiHome, FiUser, FiMessageCircle, FiBell, FiSettings, FiClipboard, FiUsers, FiBriefcase } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGetUnreadCountQuery } from "../services/notificationsApi";
import useUserState from "hooks/useUserState";

const BottomDock = ({ showLabels = false }: { showLabels?: boolean }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { userRole } = useAuth();
    const { data: notificationData } = useGetUnreadCountQuery();
    const { user } = useUserState();

    // Use user state's notification count if available, otherwise use API data
    const unreadCount = user?.unreadNotificationsCount !== undefined
        ? user.unreadNotificationsCount
        : (notificationData?.unreadCount || 0);

    // Base menu items for all users
    let menuItems = [
        { label: "Home", icon: FiHome, path: "/home" },
        { label: "Profile", icon: FiUser, path: "/profile" },
        { label: "Notifications", icon: FiBell, path: "/notifications", badge: unreadCount },
        { label: "Settings", icon: FiSettings, path: "/settings" }
    ];

    // Add role-specific items (limited to 5 total for mobile)
    if (userRole === "GOVERNMENT") {
        // Replace some items to ensure we have 5 total
        menuItems = [
            { label: "Home", icon: FiHome, path: "/home" },
            { label: "Profile", icon: FiUser, path: "/profile" },
            { label: "Projects", icon: FiClipboard, path: "/projects" },
            // { label: "Contractors", icon: FiUsers, path: "/contractors" },
            { label: "Notifications", icon: FiBell, path: "/notifications", badge: unreadCount },
            { label: "Corruption Reports", icon: FiBriefcase, path: "/reports" },
            { label: "Settings", icon: FiSettings, path: "/settings" }
        ];
    } else if (userRole === "CONTRACTOR") {
        // Replace some items to ensure we have 5 total
        menuItems = [
            { label: "Home", icon: FiHome, path: "/home" },
            { label: "Assigned Projects", icon: FiClipboard, path: "/projects" },
            { label: "Notifications", icon: FiBell, path: "/notifications", badge: unreadCount },
            { label: "Profile", icon: FiUser, path: "/profile" },
            { label: "Settings", icon: FiSettings, path: "/settings" }
        ];
    }

    return (
        <Box className="z-[1000] fixed bottom-0 left-0 w-full bg-gray-900 text-white p-2 shadow-lg">
            <Flex justify="space-around" align="center">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Flex
                            key={item.path}
                            direction="column"
                            align="center"
                            className={`p-2 cursor-pointer rounded-lg transition-all duration-200 
                                ${isActive ? "text-blue-400 bg-gray-700" : "hover:bg-gray-700"}
                            `}
                            onClick={() => router.push(item.path)}
                            position="relative"
                        >
                            {/* {item.badge && item.badge > 0 && (
                                <Badge
                                    colorScheme="red"
                                    borderRadius="full"
                                    position="absolute"
                                    top="-2px"
                                    right="-2px"
                                    fontSize="xs"
                                    minW="8px"
                                    h="8px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {item.badge > 99 ? '99+' : item.badge}
                                </Badge>
                            )} */}
                            <Icon as={item.icon} boxSize={14} />
                            {showLabels && <Text fontSize="xs" mt={1}>{item.label}</Text>}
                        </Flex>
                    );
                })}
            </Flex>
        </Box>
    );
};

export default BottomDock;
