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

  // Validate the id format
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ObjectId format" });
  }

  const query = { _id: new ObjectId(id) };  // Create the query with a valid ObjectId

  try {
    // Perform the delete operation
    const result = await reviewsCollection().deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Review not found" });
    }

    // Send the result of the delete operation
    res.send({ message: "Review successfully deleted", result });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send({ error: "An error occurred while deleting the review" });
  }
};

module.exports = {
  getReviews,
  createReview,
  deleteReview,
};
