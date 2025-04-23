"use client";

import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FiMenu, FiChevronLeft, FiHome, FiSettings, FiUser, FiBell, FiMessageCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const menuItems = [
    { label: "Home", icon: FiHome, path: "/home" },
    { label: "Profile", icon: FiUser, path: "/profile" },
    { label: "Messages", icon: FiMessageCircle, path: "/messages" },
    { label: "Notifications", icon: FiBell, path: "/notifications" },
    { label: "Settings", icon: FiSettings, path: "/settings" }
];

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
    const router = useRouter();
    const pathname = usePathname(); // Get current path

    return (
        <Box
            as="aside"
            className={`h-screen bg-gray-900 text-white transition-all duration-300 shadow-lg ${isOpen ? "w-64" : "w-[64px]"}`}
        >
            <Flex align="center" className="p-4 border-b border-gray-700">
                <Button onClick={toggleSidebar} className="text-white bg-transparent p-2">
                    <Icon as={isOpen ? FiChevronLeft : FiMenu} />
                </Button>
                {isOpen && <Text ml={4} fontSize="lg" fontWeight="bold">Dashboard</Text>}
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

export default Sidebar;
