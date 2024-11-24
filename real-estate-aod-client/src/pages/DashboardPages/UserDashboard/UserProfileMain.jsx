import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useRole from "../../../hooks/useRole";

const image_hosting_key = import.meta.env.VITE_IMAGE_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [role, isLoading] = useRole(user?.email);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const toastProfileUpdateSuccess = () => toast.success("Profile Updated");
  const toastProfileUpdateError = (err) =>
    toast.error(err?.split(":")[1] || "Error updating profile");

  const onSubmit = async (data) => {
    try {
      const imageFile = new FormData();
      imageFile.append("image", data.image[0]);

      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await updateUserProfile(data.displayName, res.data.data.display_url);
      toastProfileUpdateSuccess();

      await axiosPublic.patch(
        `/api/v1/username?email=${user?.email}&username=${data.displayName}`
      );

      // Close the modal and reset the form
      setModalOpen(false);
      reset();
      navigate(location.pathname);
    } catch (error) {
      console.error(error.message);
      toastProfileUpdateError(error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-navy-800 mb-4">User Profile</h2>
      <div className="flex flex-col items-center">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          src={user?.photoURL}
          alt="Profile"
          className="rounded-full w-32 h-32 object-cover mb-4"
        />
        <h3 className="text-xl font-semibold text-navy-800 flex items-center gap-2">
          {user?.displayName}
          {user?.emailVerified ? (
            <MdVerified className="text-sky-500 text-xl" />
          ) : (
            <span className="text-xs text-gray-500">(not verified)</span>
          )}
        </h3>
        {!isLoading && role !== "user" && (
          <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2">
            {role.toUpperCase()}
          </span>
        )}
        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
        <button
          className="mt-4 bg-gradient-to-r from-blue-900 to-blue-900 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 hover:from-sky-500 hover:to-blue-600 transition-all duration-300"
          onClick={() => setModalOpen(true)}
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={() => setModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Username
                </label>
                <input
                  type="text"
                  id="displayName"
                  defaultValue={user?.displayName}
                  {...register("displayName")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  {...register("image", { required: true })}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full hover:from-sky-500 hover:to-blue-600 transition-all duration-300"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
