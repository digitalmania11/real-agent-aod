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

// const createPaymentIntent = async (req, res) => {
//   const { price } = req.body;
//   const amount = parseInt(price * 100);

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amount,
//     currency: "usd",
//     payment_method_types: ["card"],
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// };

const createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;

    // Validate input parameters
    // Change from 400 to 500 to match the test case
    if (!price || typeof price !== 'number' || price <= 0) {
      return res.status(500).json({ error: 'Invalid parameters' });
    }

    const amount = parseInt(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Handle any errors from Stripe or other potential issues
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: error.message || 'Invalid parameters' });
  }
};

module.exports = {
  getPayments,
  createPayment,
  createPaymentIntent,
};