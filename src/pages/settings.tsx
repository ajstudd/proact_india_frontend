import {
  Box,
  Button,
  VStack,
  Divider,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useDisclosure,
  Heading,
  Flex
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiLogOut, FiLock, FiFileText, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useLogoutMutation } from "../services/authApi";
import ChangePassword from "../components/settings/ChangePassword";
import { useSubmitFeedbackMutation } from "../services/feedbackApi";

export default function Settings() {
  const router = useRouter();
  const toast = useToast();
  const { logout } = useAuth();
  const [logoutApi] = useLogoutMutation();

  // For feedback modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feedbackText, setFeedbackText] = useState("");
  const [submitFeedback, { isLoading: isSubmittingFeedback }] = useSubmitFeedbackMutation();

  // For change password modal
  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onClose: onChangePasswordClose
  } = useDisclosure();

  const handleLogout = async () => {
    try {
      // Call the logout function from AuthContext
      logout();

      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please enter your feedback before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await submitFeedback({
        description: feedbackText.trim()
      }).unwrap();

      toast({
        title: "Feedback submitted",
        description: response.message || "Thank you for your feedback!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFeedbackText("");
      onClose();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const navigateToPrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Box className=" p-4 rounded-t-lg">
        <Flex justifyContent="space-between" alignItems="center" maxWidth="6xl" mx="auto">
          <Heading as="h1" size="lg">
            Settings
          </Heading>
        </Flex>
      </Box>

      <div className="p-6 max-w-6xl mx-auto">
        <VStack spacing={4} align="stretch" w="100%" maxW="600px" mx="auto">
          {/* Account Settings Section */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>Account Settings</Text>
            <Divider mb={4} />

            <Button
              leftIcon={<FiLock />}
              variant="outline"
              w="100%"
              justifyContent="flex-start"
              mb={3}
              onClick={onChangePasswordOpen}
            >
              Change Password
            </Button>

            <Button
              leftIcon={<FiLogOut />}
              colorScheme="red"
              variant="outline"
              w="100%"
              justifyContent="flex-start"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>

          {/* Support & Info Section */}
          <Box mt={6}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>Support & Information</Text>
            <Divider mb={4} />

            <Button
              leftIcon={<FiMessageSquare />}
              variant="outline"
              w="100%"
              justifyContent="flex-start"
              mb={3}
              onClick={onOpen}
            >
              Send Feedback
            </Button>

            <Button
              leftIcon={<FiFileText />}
              variant="outline"
              w="100%"
              justifyContent="flex-start"
              onClick={navigateToPrivacyPolicy}
            >
              Privacy Policy
            </Button>
          </Box>
        </VStack>
      </div>

      {/* Feedback Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Share your thoughts with us</FormLabel>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What do you like or dislike? Any suggestions for improvement?"
                resize="vertical"
                rows={6}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleFeedbackSubmit}
              isLoading={isSubmittingFeedback}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isChangePasswordOpen} onClose={onChangePasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChangePassword onComplete={onChangePasswordClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}