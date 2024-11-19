import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { Link, useLoaderData, useLocation } from "react-router-dom";


const ScheduleMeetModal = ({ isOpen, onClose, propertyId, propertyTitle, propertyLocation }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: propertyLocation,
  });
  const { user } = useAuth();
//   const [role, isLoading] = useRole(user?.email);
  const property = useLoaderData();
  const axiosPublic = useAxiosPublic();
  const {
    agentEmail,
    
  } = property;

  const location = useLocation();


  if (!isOpen) return null; // Return nothing if modal is not open

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const meetingData = {
      ...formData,
      propertyId,
      buyerEmail: user.email, // Assuming user is logged in
      agentEmail: agentEmail, // Replace with actual agent email
      status: "pending",
    };

    axiosPublic.post("http://localhost:3000/api/v1/meetups/schedule", meetingData).then(() => {
      Swal.fire({
        title: "Meeting Scheduled!",
        text: `Your meeting for "${propertyTitle}" has been scheduled.`,
        icon: "success",
        confirmButtonText: "Okay",
      });
      onClose(); // Close the modal
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-md p-6">
        <h2 className="text-lg font-bold">Schedule a Meeting</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetModal;
