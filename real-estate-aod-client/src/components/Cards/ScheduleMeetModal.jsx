import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const MeetingScheduled = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [feedback, setFeedback] = useState("");

  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [role, isLoading] = useRole(user?.email);

  useEffect(() => {
    const fetchMeetups = async () => {
      if (!user?.email || isLoading) return;

      try {
        const response = await axiosPublic("/api/v1/meetups", {
          params: { email: user.email, role }
        });

        if (response.data.success) {
          setMeetups(response.data.data);
        }
      } catch (err) {
        setError("Error fetching meetups");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetups();
  }, [user?.email, role, isLoading]);

  const updateMeetupStatus = async (meetupId, status) => {
    try {
      const response = await axiosPublic.patch("/api/v1/meetups/update-status", {
        meetupId,
        status
      });

      if (response.data.success) {
        setMeetups(prevMeetups => 
          prevMeetups.map(meeting => 
            meeting._id === meetupId ? { ...meeting, status } : meeting
          )
        );
      }
    } catch (err) {
      setError("Error updating meetup status");
    }
  };

  const concludeMeeting = async () => {
    if (!selectedMeetup) return;

    try {
      const response = await axiosPublic.patch("/api/v1/meetups/conclude", {
        meetupId: selectedMeetup._id,
        role,
        feedback
      });

      if (response.data.success) {
        setMeetups(prevMeetups => 
          prevMeetups.map(meeting => 
            meeting._id === selectedMeetup._id
              ? { 
                  ...meeting, 
                  status: 'concluded', 
                  ...(role === "agent" 
                    ? { agentFeedback: feedback } 
                    : { buyerFeedback: feedback }
                  )
                }
              : meeting
          )
        );
        setShowModal(false);
        setFeedback("");
      }
    } catch (err) {
      setError("Error concluding the meeting");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "concluded":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const renderActionButtons = (meetup) => {
    if (role === "agent") {
      if (meetup.status === "pending") {
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => updateMeetupStatus(meetup._id, "confirmed")}
              className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition duration-300"
            >
              Confirm
            </button>
            <button
              onClick={() => updateMeetupStatus(meetup._id, "rejected")}
              className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition duration-300"
            >
              Reject
            </button>
          </div>
        );
      }
    }
    
    if ((role === "agent" || role === "user") && meetup.status === "confirmed") {
      return (
        <button
          onClick={() => {
            setSelectedMeetup(meetup);
            setShowModal(true);
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition duration-300"
        >
          Conclude
        </button>
      );
    }

    return null;
  };

  const renderFeedbackSection = (meetup) => {
    if (meetup.status !== "concluded") return null;
    
    return (
      <div className="mt-2 space-y-2 text-sm">
        {meetup.buyerFeedback && (
          <p><span className="font-medium">Buyer:</span> {meetup.buyerFeedback}</p>
        )}
        {meetup.agentFeedback && (
          <p><span className="font-medium">Agent:</span> {meetup.agentFeedback}</p>
        )}
      </div>
    );
  };

  const renderConcludeModal = () => {
    if (!showModal || !selectedMeetup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Conclude Meeting</h2>
          <div className="mb-4">
            <label htmlFor="meetupFeedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback:
            </label>
            <textarea
              id="meetupFeedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Enter your feedback"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={concludeMeeting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={feedback.trim() === ""}
            >
              Conclude Meeting
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Scheduled Meetings</h1>
      
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {meetups.length} Scheduled Meeting{meetups.length !== 1 ? 's' : ''}
          </h2>
          
          {meetups.length === 0 ? (
            <p className="text-gray-500">No meetings scheduled</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meetups.map((meetup) => (
                <div key={meetup._id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                  <div className="flex">
                    <div className={`w-2 ${getStatusColor(meetup.status)}`}></div>
                    <div className="flex-grow p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Meeting with {role === "agent" ? "Buyer" : "Agent"}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(meetup.status)}`}>
                          {meetup.status.charAt(0).toUpperCase() + meetup.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                          <span className="w-5 text-blue-600">&#128100;</span>
                          {role === "agent" ? meetup.buyerEmail : meetup.agentEmail}
                        </p>
                        <p className="flex items-center">
                          <span className="w-5 text-blue-600">&#128197;</span>
                          {new Date(meetup.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                          <span className="w-5 text-blue-600">&#128336;</span>
                          {meetup.time}
                        </p>
                        <div className="flex items-center">
                          <span className="w-5 text-blue-600">&#128205;</span>
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                              navigator.clipboard.writeText(meetup.location)
                                .then(() => alert("Location copied to clipboard!"))
                                .catch(err => console.error("Copy failed", err));
                            }}
                          >
                            Copy Location
                          </button>
                        </div>
                      </div>
                      {renderFeedbackSection(meetup)}
                      <div className="mt-4">
                        {renderActionButtons(meetup)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {renderConcludeModal()}
    </div>
  );
};

export default MeetingScheduled;