const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const offersCollection = () => getDB().collection("offers");

// Function to check if ObjectId is valid
const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

// GET offers based on query parameters
const getOffers = async (req, res) => {
  const { id, agentEmail, buyerEmail } = req.query;
  let query = {};
  
  if (id) {
    // If `id` is provided, use it to filter by `propertyID`
    query = { propertyID: id };
  }
  if (agentEmail) {
    // If `agentEmail` is provided, use it to filter by `agentEmail`
    query = { agentEmail: agentEmail };
  }
  if (buyerEmail) {
    // If `buyerEmail` is provided, use it to filter by `buyerEmail`
    query = { buyerEmail: buyerEmail };
  }

  try {
    const result = await offersCollection().find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).send({ error: 'An error occurred while retrieving offers' });
  }
};

// GET a single offer by ID
const getOfferById = async (req, res) => {
  const id = req.params.id;

  // Validate ObjectId before using it in query
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: 'Invalid ObjectId format' });
  }

  const query = { _id: new ObjectId(id) };

  try {
    const result = await offersCollection().findOne(query);
    if (!result) {
      return res.status(404).send({ error: 'Offer not found' });
    }
    res.send(result);
  } catch (error) {
    console.error('Error fetching offer by ID:', error);
    res.status(500).send({ error: 'An error occurred while retrieving the offer' });
  }
};

// POST to create a new offer
const createOffer = async (req, res) => {
  const offer = req.body;

  try {
    const result = await offersCollection().insertOne(offer);
    res.status(201).send(result); // Send status 201 for resource creation
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).send({ error: 'An error occurred while creating the offer' });
  }
};

// PUT to accept an offer
const acceptOffer = async (req, res) => {
  const { title, id } = req.query;

  // Validate ObjectId before using it in query
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: 'Invalid ObjectId format' });
  }

  const filter1 = { _id: new ObjectId(id) };
  const filter2 = {
    $and: [{ propertyTitle: title }, { status: "pending" }],
  };

  const updateDoc1 = { $set: { status: "accepted" } };
  const updateDoc2 = { $set: { status: "rejected" } };

  try {
    const result1 = await offersCollection().updateOne(filter1, updateDoc1);
    const result2 = await offersCollection().updateMany(filter2, updateDoc2);

    res.send({ result1, result2 });
  } catch (error) {
    console.error('Error accepting the offer:', error);
    res.status(500).send({ error: 'An error occurred while accepting the offer' });
  }
};

// PUT to reject an offer
const rejectOffer = async (req, res) => {
  const id = req.query.id;

  // Validate ObjectId before using it in query
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: 'Invalid ObjectId format' });
  }

  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: { status: "rejected" } };

  try {
    const result = await offersCollection().updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error('Error rejecting the offer:', error);
    res.status(500).send({ error: 'An error occurred while rejecting the offer' });
  }
};

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  acceptOffer,
  rejectOffer,
};
