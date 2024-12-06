// src/controllers/user.controller.js
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const usersCollection = () => getDB().collection("users");

const createUser = async (req, res) => {
  const user = req.body;
  console.log("req.body",req.body);
  const query = { email: user.email };
  const existingUser = await usersCollection().findOne(query);
  if (existingUser) {
    return res.send({ message: "user already exist", insertedId: null });
  }
  user.email = user.email.toLowerCase();
  const result = await usersCollection().insertOne(user);
  res.send(result);
};

const getUsers = async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query = { email: email };
  }
  const result = await usersCollection().find(query).toArray();
  res.send(result);
};

const getUserRole = async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query = { email: email.toLowerCase() };
  }

  const result = await usersCollection().findOne(query);

  // Ensure explicit 'undefined' is sent if no user is found
  if (result) {
    res.status(200).json(result.role); // Role of the user if found
  } else {
    res.status(200).json({ role: undefined }); // No content, response body will be undefined
  }
};


const updateUserRole = async (req, res) => {
  const { id, role} = req.query;

  // Validate the ObjectId format before using it
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ObjectId format' });
  }

  // Create filter object with valid ObjectId
  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: { role: role } };

  try {
    // Perform the update operation
    const result = await usersCollection().updateOne(filter, updateDoc);

    // Ensure a 200 status code and return the result
    res.status(200).send({ modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: "An error occurred while updating the user role" });
  }
};


const markUserAsFraud = async (req, res) => {
  const { id, email } = req.query;

  // Validate the ObjectId format before using it
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ObjectId format' });
  }

  // Create filter objects
  const filter1 = { _id: new ObjectId(id) }; // Now it only proceeds if the ID is valid
  const filter2 = { agentEmail: email };

  // Update documents
  const updateDoc1 = { $set: { role: "fraud" } };
  const updateDoc2 = { $set: { status: "fraud" } };

  try {
    const result = await usersCollection().updateOne(filter1, updateDoc1);
    const result2 = await getDB().collection("properties").updateMany(filter2, updateDoc2);

    // Ensure a 200 status code and return results
    res.status(200).send({ 
      result: { modifiedCount: result.modifiedCount }, // Use actual result counts
      result2: { modifiedCount: result2.modifiedCount } 
    });
  } catch (error) {
    console.error('Error marking user as fraud:', error);
    res.status(500).json({ error: "An error occurred while updating the user" });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserRole,
  updateUserRole,
  markUserAsFraud
};