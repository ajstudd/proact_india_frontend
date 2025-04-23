"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiMail, FiPhone } from "react-icons/fi";

const GovernmentInfo = () => {
    const router = useRouter();

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center mb-4 text-yellow-400">Government Onboarding</h2>
                <p className="text-gray-300 text-center">
                    Government authorities need to be manually onboarded by our team.
                    If you are a government official, please follow the steps below:
                </p>

                <div className="mt-6 space-y-4">
                    <motion.div
                        className="bg-gray-700 p-4 rounded-lg shadow-md"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="text-lg font-semibold text-yellow-300">1. Submit Your Information</h3>
                        <p className="text-gray-300">
                            Provide your official name, designation, department, and contact details.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-gray-700 p-4 rounded-lg shadow-md"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="text-lg font-semibold text-yellow-300">2. Verification Process</h3>
                        <p className="text-gray-300">
                            Our team will verify your government ID and authorization letter.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-gray-700 p-4 rounded-lg shadow-md"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="text-lg font-semibold text-yellow-300">3. Account Activation</h3>
                        <p className="text-gray-300">
                            Once verified, you will receive login credentials via email.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold text-yellow-400">Need Assistance?</h3>
                    <p className="text-gray-300">Contact our onboarding team:</p>

                    <div className="mt-4 space-y-2">
                        <p className="flex items-center justify-center">
                            <FiMail className="mr-2 text-yellow-400" />
                            <a href="mailto:support@govplatform.com" className="hover:underline">
                                support@proactindia.com
                            </a>
                        </p>
                        <p className="flex items-center justify-center">
                            <FiPhone className="mr-2 text-yellow-400" />
                            +91 1234567890
                        </p>
                    </div>

                    <button
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
                        onClick={() => router.push("/signup")}
                    >
                        Back to Registration
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default GovernmentInfo;
