const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentsCollection = () => getDB().collection("payments");
const offersCollection = () => getDB().collection("offers");

const getPayments = async (req, res) => {
  const agentEmail = req.query.agentEmail;
  let query = {};

  if (agentEmail) {
    query = { agentEmail: agentEmail };
  }

  const result = await paymentsCollection().find(query).toArray();
  res.send(result);
};

const createPayment = async (req, res) => {
  const payment = req.body;
  const result = await paymentsCollection().insertOne(payment);
  
  const options = { upsert: true };
  const filter = { _id: new ObjectId(payment.offersId) };
  const updateDoc = {
    $set: {
      status: "bought",
      transacionId: payment.transactionId,
    },
  };
  
  const updateStatus = await offersCollection().updateOne(
    filter,
    updateDoc,
    options
  );
  
  res.send({ result, updateStatus });
};

const createPaymentIntent = async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = {
  getPayments,
  createPayment,
  createPaymentIntent,
};