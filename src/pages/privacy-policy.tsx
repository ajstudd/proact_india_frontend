import React from 'react';
import { Box, Container, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function PrivacyPolicy() {
    const router = useRouter();

    return (
        <Container maxW="container.lg" py={8}>
            <Box mb={6}>
                <Button onClick={() => router.back()} variant="outline" mb={4}>
                    Back
                </Button>
                <Heading as="h1" size="xl" mb={4}>Privacy Policy</Heading>
                <Text color="gray.500">Last updated: {new Date().toLocaleDateString()}</Text>
            </Box>

            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading as="h2" size="lg" mb={3}>Introduction</Heading>
                    <Text>
                        We respect your privacy and are committed to protecting your personal data. This privacy policy will inform
                        you about how we look after your personal data when you visit our platform and tell you about your privacy
                        rights and how the law protects you.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={3}>Data We Collect</Heading>
                    <Text>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                        as follows:
                    </Text>
                    <VStack align="stretch" mt={3} spacing={2} pl={4}>
                        <Text>- Identity Data including first name, last name, username or similar identifier</Text>
                        <Text>- Contact Data including email address and telephone numbers</Text>
                        <Text>- Technical Data including IP address, login data, browser type and version</Text>
                        <Text>- Usage Data including information about how you use our platform</Text>
                        <Text>- Profile Data including your username and password, preferences, feedback and survey responses</Text>
                    </VStack>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={3}>How We Use Your Data</Heading>
                    <Text>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
                        in the following circumstances:
                    </Text>
                    <VStack align="stretch" mt={3} spacing={2} pl={4}>
                        <Text>- To register you as a new user</Text>
                        <Text>- To provide and manage your account</Text>
                        <Text>- To personalize your experience</Text>
                        <Text>- To improve our platform</Text>
                        <Text>- To communicate important updates and changes</Text>
                    </VStack>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={3}>Data Security</Heading>
                    <Text>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally
                        lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your
                        personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={3}>Your Legal Rights</Heading>
                    <Text>
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data,
                        including the right to:
                    </Text>
                    <VStack align="stretch" mt={3} spacing={2} pl={4}>
                        <Text>- Request access to your personal data</Text>
                        <Text>- Request correction of your personal data</Text>
                        <Text>- Request erasure of your personal data</Text>
                        <Text>- Object to processing of your personal data</Text>
                        <Text>- Request restriction of processing your personal data</Text>
                        <Text>- Request transfer of your personal data</Text>
                        <Text>- Right to withdraw consent</Text>
                    </VStack>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={3}>Contact Us</Heading>
                    <Text>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at:
                    </Text>
                    <Text mt={2} fontWeight="bold">
                        support@proact.com
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
}
