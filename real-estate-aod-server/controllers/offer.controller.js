const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const offersCollection = () => getDB().collection("offers");

const getOffers = async (req, res) => {
  const { id, agentEmail, buyerEmail } = req.query;
  let query = {};
  
  if (id) {
    query = { propertyID: id };
  }
  if (agentEmail) {
    query = { agentEmail: agentEmail };
  }
  if (buyerEmail) {
    query = { buyerEmail: buyerEmail };
  }

  const result = await offersCollection().find(query).toArray();
  console.log("result",result);
  res.send(result);
};

const getOfferById = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await offersCollection().findOne(query);
  
  res.send(result);
};

const createOffer = async (req, res) => {
  const offer = req.body;
  const result = await offersCollection().insertOne(offer);
  res.send(result);
};

const acceptOffer = async (req, res) => {
  const { title, id } = req.query;

  const filter1 = { _id: new ObjectId(id) };
  const filter2 = {
    $and: [{ propertyTitle: title }, { status: "pending" }],
  };
  
  const updateDoc1 = { $set: { status: "accepted" } };
  const updateDoc2 = { $set: { status: "rejected" } };
  
  const result1 = await offersCollection().updateOne(filter1, updateDoc1);
  const result2 = await offersCollection().updateMany(filter2, updateDoc2);
  
  res.send({ result1, result2 });
};

const rejectOffer = async (req, res) => {
  const id = req.query.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: { status: "rejected" } };
  const result = await offersCollection().updateOne(filter, updateDoc);
  res.send(result);
};

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  acceptOffer,
  rejectOffer,
};