const router = require("express").Router();
const {
  getPayments,
  createPayment,
  createPaymentIntent,
} = require("../controllers/payment.controller");

router.get("/payments", getPayments);
router.post("/payments", createPayment);
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;