const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const wishlistsCollection = () => getDB().collection("wishlists");

const getWishlists = async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query = { userEmail: email };
  }
  const result = await wishlistsCollection().find(query).toArray();
  res.send(result);
};

const getWishlistById = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate id format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(id) };
    const result = await wishlistsCollection().findOne(query);

    if (!result) {
      return res.status(404).send({ error: "Wishlist not found" });
    }

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching the wishlist" });
  }
};


const createWishlist = async (req, res) => {
  const wishlist = req.body;
  const result = await wishlistsCollection().insertOne(wishlist);
  res.send(result);
};

const deleteWishlist = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate id format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(id) };
    const result = await wishlistsCollection().deleteOne(query);

    // Check if the item was found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Item not found" });
    }

    // Send a response with only the `deletedCount`
    res.status(200).send({ message: "Item successfully deleted", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error occurred while deleting the wishlist:", error);
    res.status(500).send({ error: "An error occurred while deleting the item" });
  }
};



module.exports = {
  getWishlists,
  getWishlistById,
  createWishlist,
  deleteWishlist,
};
