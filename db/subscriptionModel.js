const mongoose = require("mongoose");
const SubscriptionSchema = new mongoose.Schema({
  yearly: [Object],
  monthly: [Object]

});
module.exports = mongoose.model.Subscription || mongoose.model("Subscription", SubscriptionSchema);
