import React, { useState } from 'react';
import { motion } from "framer-motion";
import { MdVerified, MdEdit } from "react-icons/md";
import { FaEye, FaHeart, FaCalendarAlt, FaDollarSign, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import UserProfile from './UserProfileMain';

const Dashboard = () => {
  // Demo data
  const statistics = [
    { title: 'Properties Viewed', value: 1234, icon: FaEye },
    { title: 'Saved Properties', value: 56, icon: FaHeart },
    { title: 'Scheduled Meetups', value: 12, icon: FaCalendarAlt },
    { title: 'Offers Made', value: 8, icon: FaDollarSign },
  ];

  const properties = [
    { id: 1, address: '123 Main St, City, State', price: 350000, status: 'For Sale', views: 45 },
    { id: 2, address: '456 Elm St, City, State', price: 275000, status: 'Pending', views: 30 },
    { id: 3, address: '789 Oak St, City, State', price: 400000, status: 'Sold', views: 60 },
  ];

  const meetups = [
    { id: 1, property: '123 Main St', date: '2023-06-15', time: '10:00 AM' },
    { id: 2, property: '456 Elm St', date: '2023-06-18', time: '2:00 PM' },
  ];

  const activityFeed = [
    { id: 1, action: 'Viewed property', property: '123 Main St', time: '2 hours ago' },
    { id: 2, action: 'Scheduled meetup', property: '456 Elm St', time: '1 day ago' },
    { id: 3, action: 'Made an offer', property: '789 Oak St', time: '3 days ago' },
  ];

  // Demo user data
  const user = {
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL: "https://i.pravatar.cc/300",
    emailVerified: true,
    role: "agent"
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'For Sale': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-100 to-blue-100 p-8 font-sans">
      {/* <h1 className="text-4xl font-bold text-navy-800 mb-8">Dashboard</h1> */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-full p-3">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-navy-800">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Property Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">Property Tracking</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-sky-100 to-blue-100">
                    <th className="p-3 text-sky-800">Address</th>
                    <th className="p-3 text-sky-800">Price</th>
                    <th className="p-3 text-sky-800">Status</th>
                    <th className="p-3 text-sky-800">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-sky-100 hover:bg-sky-50 transition-colors duration-150">
                      <td className="p-3">{property.address}</td>
                      <td className="p-3">${property.price.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="p-3">{property.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Meetups */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-navy-800 mb-4">Upcoming Meetups</h2>
              <ul className="space-y-4">
                {meetups.map((meetup) => (
                  <li key={meetup.id} className="flex items-center space-x-4 bg-gradient-to-r from-sky-50 to-white p-4 rounded-lg">
                    <div className="bg-sky-100 rounded-full p-2">
                      <FaCalendarAlt className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-800">{meetup.property}</p>
                      <p className="text-sm text-gray-500">{meetup.date} at {meetup.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-navy-800 mb-4">Activity Feed</h2>
              <ul className="space-y-4">
                {activityFeed.map((activity) => (
                  <li key={activity.id} className="flex items-center space-x-4 bg-gradient-to-r from-sky-50 to-white p-4 rounded-lg">
                    <div className="bg-sky-100 rounded-full p-2">
                      {activity.action === 'Viewed property' && <FaEye className="h-6 w-6 text-sky-600" />}
                      {activity.action === 'Scheduled meetup' && <FaCalendarAlt className="h-6 w-6 text-sky-600" />}
                      {activity.action === 'Made an offer' && <FaDollarSign className="h-6 w-6 text-sky-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.property} - {activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-navy-800 mb-4">User Profile</h2>
          {/* <div className="flex flex-col items-center">
            <motion.img
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              src={user.photoURL}
              alt=""
              className="rounded-full w-32 h-32 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-navy-800 flex items-center gap-2">
              {user.displayName}
              {user.emailVerified && <MdVerified className="text-sky-500 text-xl" />}
            </h3>
            <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2">
              {user.role.toUpperCase()}
            </span>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            <button
              className="mt-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 hover:from-sky-500 hover:to-blue-600 transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              <MdEdit /> Edit Profile
            </button>
          </div> */}
        {/* </div>  */}
        <UserProfile/>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  New username
                </label>
                <input
                  type="text"
                  id="displayName"
                  defaultValue={user.displayName}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full hover:from-sky-500 hover:to-blue-600 transition-all duration-300"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

