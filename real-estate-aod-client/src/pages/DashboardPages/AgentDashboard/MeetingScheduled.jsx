import { useEffect, useState } from "react";
import axios from "axios";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import HeaderText from "../../../components/HeaderText/HeaderText";
import useRole from "../../../hooks/useRole";

const MeetingScheduled = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [buyerFeedback, setBuyerFeedback] = useState("");
  const [agentFeedback, setAgentFeedback] = useState("");

  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [role, isLoading] = useRole(user?.email);
  

  useEffect(() => {
    // Fetch meetups for the logged-in agent
    const fetchMeetups = async () => {
      try {
        const response = await axiosPublic("/api/v1/meetups", {
          params: { email: user?.email, role: role },
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
  }, [user?.email]);

  // Function to handle updating the meetup status (confirm, reject, or conclude)
  const updateMeetupStatus = async (meetupId, status) => {
    try {
      const response = await axiosPublic.patch("/api/v1/meetups/update-status", {
        meetupId,
        status, 
      });

      if (response.data.success) {
        // Update the status locally
        setMeetups((prevMeetups) =>
          prevMeetups.map((meeting) =>
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

    let feedback;
    if(role==="agent"){
        feedback= agentFeedback;
    }else{
        feedback = buyerFeedback;
    }
      const response = await axiosPublic.patch("/api/v1/meetups/conclude", {
        meetupId: selectedMeetup._id,role,
        feedback
      });

      if (response.data.success) {
        setMeetups((prevMeetups) =>
          prevMeetups.map((meeting) =>
            meeting._id === selectedMeetup._id
              ? { ...meeting, status: "concluded", buyerFeedback, agentFeedback }
              : meeting
          )
        );
        setShowModal(false); // Close the modal
      }
    } catch (err) {
      setError("Error concluding the meeting");
    }
  };


  return (
    <div className="agent-dashboard p-5">
      <HeaderText headerText="Meetup Scheduled" />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2 className="text-2xl font-bold">Scheduled Meetings</h2>
          <div className="meetup-list mt-4 space-y-4">
            {meetups.length === 0 ? (
              <p>No upcoming meetings</p>
            ) : (
              meetups.map((meetup) => (
                <div key={meetup._id} className="meetup-card bg-white shadow-md rounded-lg p-5">
                  <h3 className="text-xl font-semibold">
                    {meetup.buyerEmail} - {meetup.status}
                  </h3>
                  <p><strong>Date:</strong> {new Date(meetup.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {meetup.time}</p>
                  <p><strong>Location:</strong> {meetup.location}</p>
                  
                  <div className="actions mt-4">
                    {meetup.status === "pending" && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => updateMeetupStatus(meetup._id, "confirmed")}
                          className="btn btn-confirm text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateMeetupStatus(meetup._id, "rejected")}
                          className="btn btn-reject text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {meetup.status === "confirmed" && (
                     <button
                     onClick={() => {
                       setSelectedMeetup(meetup);
                       setShowModal(true); // Open the modal for concluding the meeting
                     }}
                     className="btn btn-conclude text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md mt-3"
                   >    
                     Conclude
                   </button>
                    )}
                   {meetup.status === "concluded" && (
  <div className="mt-4">
    <h4 className="text-lg font-semibold">Feedback</h4>

    {/* Display Buyer Feedback */}
    <p>
      <strong>Buyer Feedback:</strong>
      {meetup.buyerFeedback ? (
        <span>{meetup.buyerFeedback}</span>
      ) : role === "user" ? (
        <>
          {/* <span>No feedback yet</span> */}
          <button
                     onClick={() => {
                       setSelectedMeetup(meetup);
                       setShowModal(true); // Open the modal for concluding the meeting
                     }}
                     className="btn btn-conclude text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md mt-3"
                   >    
                     Add Feedback
                   </button>
        </>
      ) : (
        <span>No feedback yet</span>
      )}
    </p>

    {/* Display Agent Feedback */}
    <p>
      <strong>Agent Feedback:</strong>
      {meetup.agentFeedback ? (
        <span>{meetup.agentFeedback}</span>
      ) : role === "agent" ? (
        <>
          {/* <span>No feedback yet</span> */}
          <button
                     onClick={() => {
                       setSelectedMeetup(meetup);
                       setShowModal(true); // Open the modal for concluding the meeting
                     }}
                     className="btn btn-conclude text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md mt-3"
                   >    
                     Add Feedback
                   </button>
        </>
      ) : (
        <span>No feedback yet</span>
      )}
    </p>
  </div>
)}

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

         {/* Modal for concluding the meeting */}
         {showModal && selectedMeetup && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Meeting Conclusion</h2>
            <p className="mb-4">
              After the meeting is completed, both the agent and buyer will have the option to mark the meeting as concluded. 
              Both parties can leave feedback about the meeting, such as their experience, and whether they are interested in proceeding with a deal.
            </p>
            {
               role ==="agent" ?  <div className="mb-4">
               <label htmlFor="agentFeedback" className="block font-semibold">Agent Feedback:</label>
               <textarea
                 id="agentFeedback"
                 value={agentFeedback}
                 onChange={(e) => setAgentFeedback(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded-md"
                 rows="4"
                 placeholder="Enter agent feedback"
               />
             </div> : <div className="mb-4">
              <label htmlFor="buyerFeedback" className="block font-semibold">Buyer Feedback:</label>
              <textarea
                id="buyerFeedback"
                value={buyerFeedback}
                onChange={(e) => setBuyerFeedback(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Enter buyer feedback"
              />
            </div>

            }
            
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={concludeMeeting}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Conclude Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduled;
