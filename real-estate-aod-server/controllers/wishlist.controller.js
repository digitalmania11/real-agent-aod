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
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await wishlistsCollection().findOne(query);
  res.send(result);
};

const createWishlist = async (req, res) => {
  const wishlist = req.body;
  const result = await wishlistsCollection().insertOne(wishlist);
  res.send(result);
};

const deleteWishlist = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await wishlistsCollection().deleteOne(query);
  res.send(result);
};

module.exports = {
  getWishlists,
  getWishlistById,
  createWishlist,
  deleteWishlist,
};
