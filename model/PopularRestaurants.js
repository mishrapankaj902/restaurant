const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var popularRestaurantsSchema = new Schema({
  _id: Schema.Types.ObjectId,
 // RestaurantName: { type: String, required: true },
  RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
  UserId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  CreatedDate: Date,
  ModifiedDate: Date,
  PaymentMade: Boolean,
  Amount: Number,
  SubscriptionStartDate: Date,
  SubscriptionEndDate: Date,
  SubscriptionDays: Number
});

var PopularRestaurants = mongoose.model('PopularRestaurants', popularRestaurantsSchema);

module.exports = PopularRestaurants;
