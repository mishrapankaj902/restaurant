var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restaurantTimingsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
  OpeningHours: [
    {
      Day: String,
      OpeningTime: String,
      ClosingTime : String
    }
  ]
});

// the schema is useless so far
// we need to create a model using it
var RestaurantTimings = mongoose.model('RestaurantTimings', restaurantTimingsSchema);

// make this available to our restaurant in our Node applications
module.exports = RestaurantTimings;
