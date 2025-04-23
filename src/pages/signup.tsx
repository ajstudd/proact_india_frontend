"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiMail, FiLock, FiBriefcase, FiFileText } from "react-icons/fi";
import Link from "next/link";
import { useRegisterMutation } from "@services";

interface FORMDATA {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "USER" | "CONTRACTOR" | "GOVERNMENT" | "ADMIN" | undefined;
  contractorLicense?: string;
}

const Register = () => {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation(); // RTK Mutation Hook

  const [formData, setFormData] = useState<FORMDATA>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER" as "USER" | "CONTRACTOR" | "GOVERNMENT" | "ADMIN" | undefined, // Default role
    contractorLicense: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.role === "CONTRACTOR" && !formData.contractorLicense) {
      toast.error("Contractor license is required for contractor accounts.");
      return;
    }

    try {
      if (formData.role !== "CONTRACTOR") {
        delete formData.contractorLicense;
      }
      await registerUser(formData).unwrap();
      toast.success("Registration successful! Redirecting...");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed! Please try again.");
    }
  };

  return (
    <motion.div
      className="h-full px-4 flex items-center justify-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiUser className="mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiMail className="mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiMail className="mr-2" />
            <input
              type="phone"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiLock className="mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiBriefcase className="mr-2" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-transparent outline-none flex-1"
            >
              <option value="USER" className="text-black">User</option>
              <option value="CONTRACTOR" className="text-black">Contractor</option>
            </select>
          </div>

          {formData.role === "CONTRACTOR" && (
            <div className="flex items-center border-b border-gray-600 py-2">
              <FiFileText className="mr-2" />
              <input
                type="text"
                name="contractorLicense"
                placeholder="Contractor License Number"
                value={formData.contractorLicense}
                onChange={handleChange}
                required
                className="bg-transparent outline-none flex-1"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-all"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
        <p className="mt-2 text-sm text-center text-gray-400">
          Are you a government authority? <Link href="/onboarding" className="text-yellow-400 hover:underline">Contact us here</Link>.
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
