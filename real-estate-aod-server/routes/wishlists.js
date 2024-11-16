// src/routes/wishlist.routes.js
const router = require("express").Router();
const {
  getWishlists,
  getWishlistById,
  createWishlist,
  deleteWishlist,
} = require("../controllers/wishlist.controller");

router.get("/wishlists", getWishlists);
router.get("/wishlists/:id", getWishlistById);
router.post("/wishlists", createWishlist);
router.delete("/wishlists/:id", deleteWishlist);

module.exports = router;