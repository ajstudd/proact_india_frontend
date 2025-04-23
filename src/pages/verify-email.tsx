import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Heading, Text, Spinner, Alert, AlertIcon, Button, Center } from "@chakra-ui/react";
import { useProfile } from "../hooks/useProfile";
import Link from "next/link";

const VerifyEmailPage = () => {
    const router = useRouter();
    const { token, email } = router.query;
    const { verifyEmailChange, isVerifyEmailLoading, isVerifyEmailSuccess, verifyEmailError } = useProfile();
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationAttempted, setVerificationAttempted] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (token && email && typeof token === 'string' && typeof email === 'string' && !verificationAttempted) {
                setVerificationAttempted(true);
                try {
                    await verifyEmailChange(token, email);
                    setVerified(true);
                    setTimeout(() => window.location.href = '/profile', 1000);
                } catch (err: any) {
                    setError(err.data?.message || 'Verification failed. Please try again.');
                }
            }
        };

        if (token && email && !verified && !error && !verificationAttempted) {
            verifyEmail();
        }
    }, [token, email, verifyEmailChange, router, verified, error, verificationAttempted]);

    if (isVerifyEmailLoading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" color="blue.500" />
                <Text mt={4}>Verifying your email...</Text>
            </Box>
        );
    }

    return (
        <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading as="h1" size="xl" textAlign="center" mb={6}>
                Email Verification
            </Heading>

            {verified ? (
                <>
                    <Alert status="success" borderRadius="md" mb={6}>
                        <AlertIcon />
                        Your email has been successfully verified! Redirecting to profile...
                    </Alert>
                    <Center>
                        <Link href="/profile" passHref>
                            <Button colorScheme="blue">Go to Profile</Button>
                        </Link>
                    </Center>
                </>
            ) : error ? (
                <>
                    <Alert status="error" borderRadius="md" mb={6}>
                        <AlertIcon />
                        {error}
                    </Alert>
                    <Center>
                        <Link href="/profile" passHref>
                            <Button colorScheme="blue">Back to Profile</Button>
                        </Link>
                    </Center>
                </>
            ) : (
                <Text textAlign="center">Processing verification...</Text>
            )}
        </Box>
    );
};

export default VerifyEmailPage;
