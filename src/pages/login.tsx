"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import Link from "next/link";
import { useLoginMutation } from "@services";
import CryptoJS from "crypto-js";
import { setAuthData } from "@utils"; // Import auth utils

const SECRET_KEY = "your-secret-key"; // Store securely in .env

const encryptEmail = (email: string) => {
  return encodeURIComponent(CryptoJS.AES.encrypt(email, SECRET_KEY).toString());
};

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(formData).unwrap();
      toast.success("Login successful!");

      const { token, user } = response?.resp;

      // ✅ Store token & user details
      setAuthData(token, user);

      if (!user.isVerified) {
        const encryptedEmail = encryptEmail(user.email || "");
        toast.info("Account not verified. Redirecting to OTP verification...");
        router.push(`/otp/${encryptedEmail}`);
      } else {
        router.push("/home");
      }
    } catch (error: any) {
      if (error.data?.code === 403) {
        const encryptedEmail = encryptEmail(formData.email);
        toast.error("Account not verified. Redirecting to OTP verification...");
        router.push(`/otp/${encryptedEmail}`);
      } else {
        toast.error(error.data?.message || "Login failed");
      }
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
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <FiLock className="mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-all">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don&apos;t have an account? <Link href="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
