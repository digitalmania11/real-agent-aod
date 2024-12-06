import React from 'react';

const ScheduleMeeting = ({ role, loading, meeting, openModal }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="mt-6 p-6 bg-white shadow-lg rounded-2xl border border-blue-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-600">Schedule a Meeting</h2>
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      {role === "agent" ? (
        <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm">
            You are logged in as an agent. Scheduling is not available.
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="text-sm">Loading meeting status...</p>
        </div>
      ) : meeting ? (
        <div className="space-y-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(meeting.status)}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold">
              Status: {meeting.status}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">
              {new Date(meeting.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{meeting.time}</p>
          </div>
          <div className="flex items-start space-x-2 text-gray-600">
            <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm break-words">
              {meeting.location?.trim().length > 30 
                ? `${meeting.location.trim().substring(0, 30)}...` 
                : meeting.location?.trim()}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Interested in this property? Schedule a meeting with our agent to know more.
          </p>
          <button 
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={openModal}
          >
            Schedule Meet
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;