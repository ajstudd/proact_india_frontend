"use client";

import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FiMenu, FiChevronLeft, FiHome, FiClipboard, FiUsers, FiBell, FiBriefcase, FiSettings, FiUser, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

// Common menu items for all users
const commonMenuItems = [
    { label: "Home", icon: FiHome, path: "/home" },
    { label: "Profile", icon: FiUser, path: "/profile" },
    { label: "Notifications", icon: FiBell, path: "/notifications" },
    { label: "Settings", icon: FiSettings, path: "/settings" },
];

// Role-specific menu items
const roleSpecificItems = {
    GOVERNMENT: [
        // { label: "Contractors", icon: FiUsers, path: "/contractors" },
        { label: "Corruption Reports", icon: FiBriefcase, path: "/reports" },
        { label: "Projects", icon: FiClipboard, path: "/projects" },
    ],
    CONTRACTOR: [
        { label: "Assigned Projects", icon: FiClipboard, path: "/projects" },
    ],
    USER: [], // Regular users don't have additional menu items
    ADMIN: [
        { label: "Dashboard", icon: FiClipboard, path: "/admin" },
        { label: "Users", icon: FiUsers, path: "/admin/users" },
        { label: "Reports", icon: FiBriefcase, path: "/admin/reports" },
    ]
};

const UnifiedSidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { userRole } = useAuth();

    // Combine common items with role-specific items
    const menuItems = [
        ...commonMenuItems,
        ...(userRole ? roleSpecificItems[userRole as keyof typeof roleSpecificItems] || [] : []),
    ];

    // Get title based on user role
    const getSidebarTitle = () => {
        switch (userRole) {
            case "GOVERNMENT": return "Government";
            case "CONTRACTOR": return "Contractor";
            case "ADMIN": return "Admin";
            default: return "Dashboard";
        }
    };

    return (
        <Box
            as="aside"
            className={`h-screen bg-gray-900 text-white transition-all duration-300 shadow-lg ${isOpen ? "w-64" : "w-[64px]"}`}
        >
            <Flex align="center" className="p-4 border-b border-gray-700">
                <Button onClick={toggleSidebar} className="text-white bg-transparent p-2">
                    <Icon as={isOpen ? FiChevronLeft : FiMenu} />
                </Button>
                {isOpen && <Text ml={4} fontSize="lg" fontWeight="bold">{getSidebarTitle()}</Text>}
            </Flex>

            <Box p={4} className="overflow-hidden hover:overflow-y-auto h-[calc(100vh-64px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`flex items-center rounded-lg w-full transition-all duration-200
                  ${isOpen ? "pl-[20px] h-[40px]" : "justify-center h-[40px]"} 
                  ${isActive ? "bg-gray-700 text-blue-400" : "bg-transparent text-white hover:bg-gray-700"}
                `}
                            >
                                <Icon as={item.icon} className={`${isOpen ? "mr-2" : ""}`} />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isOpen ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isOpen && <Text>{item.label}</Text>}
                                </motion.div>
                            </button>
                        );
                    })}
                </div>
            </Box>
        </Box>
    );
};

export default UnifiedSidebar;
