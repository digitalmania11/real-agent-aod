const router = require("express").Router();
const {
  getOffers,
  getOfferById,
  createOffer,
  acceptOffer,
  rejectOffer,
} = require("../controllers/offer.controller");

router.get("/offers", getOffers);
router.get("/offers/:id", getOfferById);
router.post("/offers", createOffer);
router.patch("/accepted-offer", acceptOffer);
router.patch("/rejected-offer", rejectOffer);

module.exports = router;