import React, { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    FormErrorMessage,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useResetPasswordMutation } from '../../services/userApi';

interface ChangePasswordProps {
    onComplete: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onComplete }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Use the reset password mutation
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const toast = useToast();

    const validateForm = () => {
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };

        let isValid = true;

        if (!currentPassword) {
            newErrors.currentPassword = 'Current password is required';
            isValid = false;
        }

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
            isValid = false;
        } else if (newPassword.length < 6) {
            // Changed from 8 to 6 to match backend validation
            newErrors.newPassword = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Call the reset password API endpoint
            const response = await resetPassword({
                oldPassword: currentPassword,
                newPassword: newPassword
            }).unwrap();

            toast({
                title: 'Success',
                description: response.message || 'Password changed successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onComplete();
        } catch (error: any) {
            const errorMessage = error.data?.message || 'Error changing password. Please try again.';

            // Check for specific error messages from the backend
            if (errorMessage.includes('incorrect')) {
                setErrors({
                    ...errors,
                    currentPassword: 'Current password is incorrect'
                });
            }

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.currentPassword}>
                    <FormLabel>Current Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                                icon={showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.newPassword}>
                    <FormLabel>New Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                icon={showNewPassword ? <FiEyeOff /> : <FiEye />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirm New Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    width="100%"
                    mt={4}
                >
                    Change Password
                </Button>
            </VStack>
        </form>
    );
};

export default ChangePassword;
