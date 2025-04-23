"use client";

import { Box, Flex } from "@chakra-ui/react";
import Header from "./DynamicLayoutHeader"; // Header only, no sidebar or bottom dock

const LoggedOutLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Flex direction="column" className="h-screen w-full fixed">
            <Header hideSearch={true} /> {/* Keep header for branding & navigation */}
            <Flex className="flex-1 pt-12 h-[calc(100vh-64px)] justify-center items-center">
                <Box as="main" className="transition-all duration-300 flex-1 bg-gray-100 overflow-y-auto h-full">
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
};

export default LoggedOutLayout;
