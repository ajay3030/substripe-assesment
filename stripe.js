// This is your test secret API key.
const stripRoute =(app)=>{
const stripe = require('stripe')('sk_test_51LSc1WSBAlsRnsXiyFsGESsJuqsgmyaoeOerc9Vn5alzdIepDRoPRdy5bc70o1CyNZSTUfe2l7n4goZa1eyjtBZn003svCJhyu');
const express = require('express')
require('dotenv').config()
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: req.body.billing_id,
    line_items: [
      {
        price: req.body.lookup_key,
        quantity: 1
      }
    ],
    success_url: `${YOUR_DOMAIN}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.json(session.url);
});

app.post('/get-subscription-sessions',async(req,res)=>{
  const subscriptions = await stripe.checkout.sessions.list({
    limit: 1,
    customer: req.body.billing_id,
  });
  res.json(subscriptions);
})

app.post('/get-subscription-data',async(req,res)=>{
  const subscriptions = await stripe.subscriptions.list({
    limit: 1,
    customer: req.body.billing_id,
    status: 'active',
  });
  res.json(subscriptions);
})

app.post('/create-portal-session', async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    let event = request.body;
    const endpointSecret = 'whsec_67b78e7a9f46f49cb2bc60303dff53cb426799aace4ad998ec80feb458ff0dcf';
    if (endpointSecret) {
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    let subscription;
    let status;
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
    response.send();
  }
)}
module.exports = stripRoute;