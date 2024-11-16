const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const reviewsCollection = () => getDB().collection("reviews");

const getReviews = async (req, res) => {
  const { id, email } = req.query;
  let query = {};
  
  if (id) {
    query = { propertyID: id };
  }
  if (email) {
    query = { userEmail: email };
  }

  const result = await reviewsCollection()
    .find(query)
    .sort({ reviewTime: -1 })
    .toArray();
  res.send(result);
};

const createReview = async (req, res) => {
  const review = req.body;
  const result = await reviewsCollection().insertOne(review);
  res.send(result);
};

const deleteReview = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await reviewsCollection().deleteOne(query);
  res.send(result);
};

module.exports = {
  getReviews,
  createReview,
  deleteReview,
};
