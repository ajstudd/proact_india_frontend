import { ChakraProvider, Box, Flex, Heading, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const carouselImages = [
    "/hero1.png",
    "/hero2.png",
    "/hero3.png",
    "/hero4.png",
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            position="relative"
            overflow="hidden"
            height={{ base: "80vh", md: "100vh" }}
            width="100%"
        >
            {/* Carousel Images */}
            {carouselImages.map((image, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentIndex === index ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Image
                        src={image}
                        alt={`Slide ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        quality={80}
                    />
                </motion.div>
            ))}

            {/* Text Content */}
            <Flex
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                justify="center"
                align="center"
                textAlign="center"
                px={6}
            >
                <Box
                    color="white"
                    bg="rgba(0, 0, 0, 0.6)"
                    p={6}
                    rounded="lg"
                    maxWidth="lg"
                >
                    <Heading
                        as="h1"
                        size={{ base: "xl", md: "2xl", lg: "3xl" }}
                        fontWeight="bold"
                        mb={4}
                    >
                        Empowering Transparency, Together
                    </Heading>
                    <Text
                        fontSize={{ base: "sm", md: "md", lg: "lg" }}
                        mb={6}
                    >
                        Discover, monitor, and contribute to a transparent future in governance.
                    </Text>
                    <Button size="lg" colorScheme="teal">
                        Learn More
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
}
