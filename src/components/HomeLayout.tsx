"use client";

import { useState } from "react";
import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import Header from "./DynamicLayoutHeader";
import { ChakraProvider } from "@chakra-ui/react";
import Sidebar from "./DynamicSidebar";
import BottomDock from "./BottomDock"; // Import BottomDock

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile] = useMediaQuery("(max-width: 768px)"); // Detect mobile screens

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Flex direction="column" className="h-screen w-full fixed">
            <Header />
            <Flex className="flex-1 pt-16 h-[calc(100vh-64px)]">
                {!isMobile && <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />}
                <Box as="main" className="transition-all duration-300 flex-1 bg-gray-100 overflow-y-auto h-full">
                    <ChakraProvider>
                        {children}
                    </ChakraProvider>
                </Box>
            </Flex>
            {isMobile && <BottomDock />} {/* Show BottomDock only on mobile screens */}
        </Flex>
    );
};

export default Layout;
