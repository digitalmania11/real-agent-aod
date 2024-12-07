// src/controllers/property.controller.js
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const meetupsCollection = () => getDB().collection("meetups");

// 1. Schedule a Meetup
const scheduleMeetup = async (req, res) => {
  const { buyerEmail, agentEmail, propertyId, date, time, location } = req.body;

  if (!buyerEmail || !agentEmail || !propertyId || !date || !time || !location) {
    return res.status(400).send({ error: "All fields are required." });
  }

  const newMeetup = {
    buyerEmail,
    agentEmail,
    propertyId: new ObjectId(propertyId),
    date: new Date(date),
    time,
    location,
    status: "pending", // Default status
  };

  const result = await meetupsCollection().insertOne(newMeetup);
  res.send({ success: true, message: "Meetup scheduled successfully.", data: result });
};

// 2. Confirm or Reject a Meetup
const updateMeetupStatus = async (req, res) => {
  const { meetupId, status } = req.body;

  if (!meetupId || !["confirmed", "rejected"].includes(status)) {
    return res.status(400).send({ error: "Invalid request." });
  }

  // statsus could be as, tobeconfirmed, confirmed, concluded
  const filter = { _id: new ObjectId(meetupId) };
  const updateDoc = { $set: { status } };

  const result = await meetupsCollection().updateOne(filter, updateDoc);
  res.send({ success: true, message: `Meetup status updated to ${status}.`, data: result });
};

// 3. Mark a Meetup as Concluded and Add Feedback
const concludeMeetup = async (req, res) => {
  const { meetupId,role, feedback } = req.body;
    let agentFeedback="",buyerFeedback="";
  if(role === "agent"){
    agentFeedback = feedback;
  }else{
    buyerFeedback=feedback;
  }

  if (!meetupId) {
    return res.status(400).send({ error: "Meetup ID is required." });
  }

  const filter = { _id: new ObjectId(meetupId) };
  const updateDoc = {
    $set: {
      status: "concluded",
      ...(buyerFeedback && { buyerFeedback }),
      ...(agentFeedback && { agentFeedback }),
    },
  };

  const result = await meetupsCollection().updateOne(filter, updateDoc);
  res.send({ success: true, message: "Meetup marked as concluded.", data: result });
};

const getMeetingStatus = async (req, res) => {
    const { propertyId, buyerEmail } = req.query;
  
    if (!propertyId || !buyerEmail) {
      return res.status(400).send({ error: "Property ID and buyer email are required." });
    }
  
    const meeting = await meetupsCollection().findOne({
      propertyId: new ObjectId(propertyId),
      buyerEmail: buyerEmail, // Filter by logged-in user
    });
  
    if (!meeting) {
      return res.status(404).send({ error: "No meeting scheduled for this property by this user." });
    }
  
    res.send({ success: true, data: meeting });
  };

// 4. Get Meetups by User (Buyer or Agent)
// 4. Get Meetups by User (Buyer or Agent)
const getMeetups = async (req, res) => {
  const { email, role } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Validate input
  if (!email || !["user", "agent"].includes(role)) {
    return res.status(400).send({ error: "Invalid request." });
  }

  try {
    // Construct query based on role
    const query = role === "user" 
      ? { 
          buyerEmail: email, 
          // Optional: Add status filter if needed
          status: { $in: ['pending', 'confirmed'] }
        } 
      : { 
          agentEmail: email,
          // Optional: Add status filter if needed
          status: { $in: ['pending', 'confirmed'] }
        };

    // Count total matching documents
    const totalMeetups = await meetupsCollection().countDocuments(query);

    // Find meetups with pagination
    const meetups = await meetupsCollection()
      .find(query)
      .sort({ date: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      success: true,
      data: meetups,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMeetups / limit),
        totalMeetups
      }
    });
  } catch (error) {
    res.status(500).send({ 
      success: false, 
      error: "An error occurred while fetching meetups" 
    });
  }
};

module.exports = {
  scheduleMeetup,
  updateMeetupStatus,
  concludeMeetup,
  getMeetups,
  getMeetingStatus
};
