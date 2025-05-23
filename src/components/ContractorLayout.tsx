"use client";

import { useState } from "react";
import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import Header from "./DynamicLayoutHeader";
import ContractorSidebar from "./ContractorSidebar"; // Contractor-specific sidebar
import BottomDock from "./BottomDock";

const ContractorLayout = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile] = useMediaQuery("(max-width: 768px)"); // Detect mobile screens

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Flex direction="column" className="h-screen w-full fixed">
            <Header />
            <Flex className="flex-1 pt-16 h-[calc(100vh-64px)]">
                {!isMobile && <ContractorSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />}
                <Box as="main" className="transition-all duration-300 flex-1 bg-gray-100 overflow-y-auto h-full p-4">
                    {children}
                </Box>
            </Flex>
            {isMobile && <BottomDock />} {/* Show BottomDock only on mobile screens */}
        </Flex>
    );
};

export default ContractorLayout;
