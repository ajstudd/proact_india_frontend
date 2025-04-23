import React from "react";
import {
    ChakraProvider,
    Box,
    Heading,
    Text,
    Flex,
    Image,
    VStack,
    HStack,
    Stack,
    Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const AboutUs = () => {
    return (
        <ChakraProvider>
            <Box
                bgGradient="linear(to-b, blue.50, white)"
                minHeight="100vh"
                px={{ base: 6, md: 16 }}
                py={12}
                color="gray.800"
            >
                {/* Header Section */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    align="center"
                    justify="space-between"
                    mb={12}
                >
                    <VStack align="start" spacing={6} maxW="lg">
                        <Heading as="h1" size="2xl" fontWeight="bold">
                            About Us
                        </Heading>
                        <Text fontSize="lg">
                            Our mission is to promote transparency, foster collaboration, and
                            make impactful changes in the world through technology.
                        </Text>
                        <Button
                            size="lg"
                            colorScheme="teal"
                            variant="solid"
                            as={motion.a}
                            whileHover={{ scale: 1.05 }}
                        >
                            Contact Us
                        </Button>
                    </VStack>

                    <Image
                        src="/images/about-us-illustration.png"
                        alt="About Us"
                        boxSize={{ base: "250px", md: "400px" }}
                        mt={{ base: 8, md: 0 }}
                        as={motion.img}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition="0.5s"
                    />
                </Flex>

                {/* Team Section */}
                <Box textAlign="center" mb={16}>
                    <Heading as="h2" size="xl" fontWeight="semibold" mb={4}>
                        Meet Our Team
                    </Heading>
                    <Text fontSize="md" color="gray.600">
                        A group of passionate individuals driving change with innovation.
                    </Text>
                </Box>

                <Flex
                    wrap="wrap"
                    justify="center"
                    gap={8}
                    maxWidth="1200px"
                    mx="auto"
                >
                    {teamMembers.map((member) => (
                        <TeamCard key={member.name} {...member} />
                    ))}
                </Flex>

                {/* Values Section */}
                <Box mt={16} textAlign="center">
                    <Heading as="h2" size="xl" fontWeight="semibold" mb={4}>
                        Our Core Values
                    </Heading>
                    <Text fontSize="md" mb={12} color="gray.600">
                        What defines us and drives our mission forward.
                    </Text>

                    <Flex wrap="wrap" justify="center" gap={8} maxWidth="1000px" mx="auto">
                        {values.map((value) => (
                            <ValueCard key={value.title} {...value} />
                        ))}
                    </Flex>
                </Box>
            </Box>
        </ChakraProvider>
    );
};

const TeamCard = ({ name, role, imageUrl }: {
    name: string;
    role: string;
    imageUrl: string;
}) => (
    <Box
        bg="white"
        color="gray.800"
        rounded="2xl"
        shadow="md"
        maxW="sm"
        p={6}
        textAlign="center"
        as={motion.div}
        whileHover={{ scale: 1.05 }}
    >
        <Image
            src={imageUrl}
            alt={name}
            boxSize="120px"
            rounded="full"
            mx="auto"
            mb={4}
        />
        <Heading as="h3" size="md" fontWeight="semibold">
            {name}
        </Heading>
        <Text fontSize="sm" color="gray.600">
            {role}
        </Text>
    </Box>
);

const ValueCard = ({ title, description }: {
    title: string;
    description: string;
}) => (
    <Flex
        direction="column"
        align="center"
        bg="white"
        color="gray.800"
        rounded="2xl"
        shadow="lg"
        p={6}
        maxW="xs"
        textAlign="center"
        as={motion.div}
        whileHover={{ scale: 1.05 }}
    >
        <Heading as="h4" size="md" fontWeight="semibold" mb={3}>
            {title}
        </Heading>
        <Text fontSize="sm" color="gray.600">
            {description}
        </Text>
    </Flex>
);

const teamMembers = [
    {
        name: "Alice Johnson",
        role: "Founder & CEO",
        imageUrl: "/images/team-alice.png",
    },
    {
        name: "Mark Evans",
        role: "CTO",
        imageUrl: "/images/team-mark.png",
    },
    {
        name: "Sophia Lee",
        role: "Head of Design",
        imageUrl: "/images/team-sophia.png",
    },
];

const values = [
    {
        title: "Transparency",
        description: "We believe in open communication and clear intentions.",
    },
    {
        title: "Innovation",
        description: "We embrace creativity to solve real-world problems.",
    },
    {
        title: "Collaboration",
        description: "Together, we achieve more and grow stronger.",
    },
];

export default AboutUs;
