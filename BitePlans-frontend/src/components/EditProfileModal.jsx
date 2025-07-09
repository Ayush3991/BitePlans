import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from "../firebase";
import axios from "axios";
import { toast } from 'react-hot-toast';

const EditProfileModal = ({ onClose }) => {
  const { user, refreshUser } = useUser();
  const modalRef = useRef(null);

  const [name, setName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  // Preview image on selection
  useEffect(() => {
    if (!profilePic) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(profilePic);
  }, [profilePic]);

const handleSave = async () => {
  setLoading(true);

  try {
    const currentUser = auth.currentUser;
    const token = await currentUser.getIdToken();

    const formData = new FormData();
    formData.append("name", name);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    await axios.put("/api/v1/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    await refreshUser(); 
    toast.success("Profile updated successfully");
    onClose();
  } catch (err) {
    console.error("Update Error:", err);
    toast.error("Something went wrong ");
  } finally {
    setLoading(false);
  }
};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Profile</h2>

          {/* Profile Image */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-xl text-white bg-gradient-to-r from-blue-500 to-purple-600">
                  {user?.displayName?.charAt(0)?.toUpperCase() }
                </span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="text-sm text-gray-600 dark:text-gray-300"
            />
          </div>

          {/* Username */}
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          {/* Email (Read-only) */}
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full mb-6 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
