"use client";

import { motion } from "framer-motion";
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaUser, FaEdit, FaBookmark, FaComments, FaProjectDiagram } from "react-icons/fa";
import { useState } from "react";
import EditProfileModal from "../components/profile/EditProfileModal";
import UserCommentsTab from "../components/profile/UserCommentsTab";
import BookmarkedProjectsTab from "../components/profile/BookmarkedProjectsTab";
import UserProjectsTab from "../components/profile/UserProjectsTab";
import useUserState from "hooks/useUserState";
import { Heading } from "@chakra-ui/react";

type TabType = "comments" | "bookmarks" | "projects";

export default function Profile() {
  const user = useUserState();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("comments");

  // Extract user details
  const profileInfo = {
    name: user?.user.name || "Unknown User",
    email: user?.user.email || "No Email Provided",
    isVerified: user?.user.isVerified || false,
    profile: user?.user.photo || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=", // Default avatar
    role: user?.user.role || "USER",
    contractorId: user?.user.contractorLicense,
    governmentId: user?.user.governmentId,
  };

  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <motion.div
      className="flex flex-col rounded-lg bg-gray-900 text-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gray-800 p-4 rounded-t-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Heading as="h1" size="lg">
            Profile
          </Heading>
        </div>
      </div>

      {/* Profile content */}
      <div className="p-6 max-w-6xl mx-auto w-full">
        {/* Profile Card */}
        <motion.div
          className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg text-center mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500 shadow-md"
            src={profileInfo.profile}
            alt="Profile"
          />
          <h2 className="text-2xl font-bold mt-4">{profileInfo.name}</h2>
          <p className="text-gray-400">{profileInfo.email}</p>

          {/* User Role & Verification Status */}
          <div className="mt-4 flex justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              {profileInfo.isVerified ? (
                <>
                  <FaCheckCircle className="text-green-400 text-xl" />
                  <p className="text-sm font-semibold">Verified</p>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-red-400 text-xl" />
                  <p className="text-sm font-semibold">Not Verified</p>
                </>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 mx-auto"
            onClick={handleEditProfile}
          >
            <FaEdit /> Edit Profile
          </button>
        </motion.div>

        {/* Sections */}
        <motion.div
          className="mt-8 w-full max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-700 pb-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'comments' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-blue-300'}`}
              onClick={() => handleTabChange('comments')}
            >
              <FaComments /> My Comments
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'bookmarks' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-blue-300'}`}
              onClick={() => handleTabChange('bookmarks')}
            >
              <FaBookmark /> Bookmarked Projects
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'comments' && <UserCommentsTab />}
            {activeTab === 'bookmarks' && <BookmarkedProjectsTab />}
            {/* {activeTab === 'projects' && <UserProjectsTab />} */}
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </motion.div>
  );
}
