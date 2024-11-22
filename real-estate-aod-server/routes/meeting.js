const express = require("express");
const {
  scheduleMeetup,
  updateMeetupStatus,
  concludeMeetup,
  getMeetups,
  getMeetingStatus
} = require("../controllers/meeting.controller");

const router = express.Router();

// Schedule a meetup
router.post("/meetups/schedule", scheduleMeetup);

router.get("/meeting-status", getMeetingStatus);


// Update meetup status (confirm or reject)
router.patch("/meetups/update-status", updateMeetupStatus);

// Conclude a meetup and add feedback
router.patch("/meetups/conclude", concludeMeetup);

// Get meetups for a user
router.get("/meetups", getMeetups);

module.exports = router;
