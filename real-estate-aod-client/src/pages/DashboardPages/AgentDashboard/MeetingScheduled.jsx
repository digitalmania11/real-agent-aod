import { useEffect, useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";

const MeetingScheduled = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [userFeedback, setUserFeedback] = useState("");
  const [agentFeedback, setAgentFeedback] = useState("");
  const [expandedFeedback, setExpandedFeedback] = useState(null);

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
    try {
      const feedback = role === "agent" ? agentFeedback : userFeedback;
      
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
                  status: "concluded", 
                  ...(role === "agent" 
                    ? { agentFeedback: feedback } 
                    : { buyerFeedback: feedback }
                  )
                }
              : meeting
          )
        );
        setShowModal(false);
        setUserFeedback("");
        setAgentFeedback("");
      }
    } catch (err) {
      setError("Error concluding the meeting");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "concluded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderActionButtons = (meetup) => {
    if (role === "agent") {
      if (meetup.status === "pending") {
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => updateMeetupStatus(meetup._id, "confirmed")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
            >
              &#10003; Confirm
            </button>
            <button
              onClick={() => updateMeetupStatus(meetup._id, "rejected")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              &#10007; Reject
            </button>
          </div>
        );
      }
      
      if (meetup.status === "confirmed") {
        return (
          <button
            onClick={() => {
              setSelectedMeetup(meetup);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            Conclude
          </button>
        );
      }
    }
    
    if (role === "user" && meetup.status === "confirmed") {
      return (
        <button
          onClick={() => {
            setSelectedMeetup(meetup);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Conclude
        </button>
      );
    }

    return null;
  };

  const renderFeedbackSection = (meetup) => {
    if (meetup.status !== "concluded") return null;
    
    const hasFeedback = meetup.buyerFeedback || meetup.agentFeedback;
    if (!hasFeedback) return null;

    const isExpanded = expandedFeedback === meetup._id;

    return (
      <div className="mt-4">
        <button
          onClick={() => setExpandedFeedback(isExpanded ? null : meetup._id)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          {isExpanded ? "Hide Feedback" : "View Feedback"}
        </button>
        {isExpanded && (
          <div className="mt-2 space-y-2">
            {meetup.buyerFeedback && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Buyer Feedback:</p>
                <p className="text-sm text-gray-600">{meetup.buyerFeedback}</p>
              </div>
            )}
            {meetup.agentFeedback && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Agent Feedback:</p>
                <p className="text-sm text-gray-600">{meetup.agentFeedback}</p>
              </div>
            )}
          </div>
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
              {role === "agent" ? "Agent" : "Buyer"} Feedback:
            </label>
            <textarea
              id="meetupFeedback"
              value={role === "agent" ? agentFeedback : userFeedback}
              onChange={(e) => 
                role === "agent" 
                  ? setAgentFeedback(e.target.value) 
                  : setUserFeedback(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder={`Enter ${role === "agent" ? "agent" : "buyer"} feedback`}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={concludeMeeting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                role === "agent" 
                  ? agentFeedback.trim() === "" 
                  : userFeedback.trim() === ""
              }
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
                <div key={meetup._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-4 py-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-blue-600">
                        {role === "agent" ? "Meeting with Buyer" : "Meeting with Agent"}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(meetup.status)}`}>
                        {meetup.status.charAt(0).toUpperCase() + meetup.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">&#128100;</span>
                        <span className="text-sm">{meetup.buyerEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">&#128197;</span>
                        <span className="text-sm">{new Date(meetup.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">&#128336;</span>
                        <span className="text-sm">{meetup.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">&#128205;</span>
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(meetup.location || "Location not specified")
                              .then(() => alert("Location copied to clipboard!"))
                              .catch(err => console.error("Copy failed", err));
                          }}
                        >
                          Copy Location
                        </button>
                      </div>
                    </div>
                    {renderFeedbackSection(meetup)}
                  </div>
                  <div className="px-4 py-3 bg-gray-50">
                    {renderActionButtons(meetup)}
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

