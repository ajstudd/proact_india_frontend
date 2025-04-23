import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Avatar,
    Flex,
    Box,
    Tooltip,
    Icon,
    useToast
} from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";
import { useProfile } from "../../hooks/useProfile";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const toast = useToast();
    const {
        profileData,
        editProfile,
        isEditProfileLoading,
        imagePreview,
        handleImageChange,
        setImagePreview
    } = useProfile();

    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
        photo: null as File | null | undefined
    });

    useEffect(() => {
        if (profileData) {
            setFormValues({
                name: profileData.name || "",
                email: profileData.email || "",
                phone: profileData.phone || "",
                photo: null
            });
        }
    }, [profileData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormValues((prevValues) => ({
                ...prevValues,
                photo: file
            }));
            handleImageChange(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", formValues.name);
            formData.append("email", formValues.email);
            formData.append("phone", formValues.phone);
            if (formValues.photo) {
                formData.append("photo", formValues.photo);
            }

            await editProfile(formData);

            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        } catch (error: any) {
            console.error("Profile update error:", error);
            toast({
                title: "Update failed",
                description: error.data?.message || "Something went wrong during profile update",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <Flex direction="column" alignItems="center" w="full">
                                <Avatar
                                    size="2xl"
                                    src={imagePreview || profileData?.photo || undefined}
                                    name={profileData?.name}
                                    mb={4}
                                />
                                <FormControl>
                                    <FormLabel htmlFor="photo" cursor="pointer">
                                        <Button size="sm" as="span">
                                            Change Photo
                                        </Button>
                                        <Input
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            hidden
                                        />
                                    </FormLabel>
                                </FormControl>
                            </Flex>

                            <FormControl>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="email">
                                    Email
                                    <Tooltip
                                        label="Email changes require verification via a link sent to your new email"
                                        placement="top"
                                    >
                                        <Box as="span" ml={1} display="inline-block">
                                            <Icon as={FaInfoCircle} color="gray.500" />
                                        </Box>
                                    </Tooltip>
                                </FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formValues.email}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="phone">
                                    Phone
                                    <Tooltip
                                        label="Phone number changes require verification"
                                        placement="top"
                                    >
                                        <Box as="span" ml={1} display="inline-block">
                                            <Icon as={FaInfoCircle} color="gray.500" />
                                        </Box>
                                    </Tooltip>
                                </FormLabel>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formValues.phone}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </VStack>

                        <ModalFooter px={0}>
                            <Button variant="outline" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                isLoading={isEditProfileLoading}
                                type="submit"
                            >
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;
