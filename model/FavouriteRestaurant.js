const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var favouriteRestaurantSchema = new Schema({
  _id: Schema.Types.ObjectId,
  RestaurantName: { type: String, required: true },
  RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
  UserId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  FirstName: { type: String },
  LastName: { type: String },
  CreatedDate: Date,
  ModifiedDate: Date
});

var FavouriteRestaurant = mongoose.model('FavouriteRestaurant', favouriteRestaurantSchema);

module.exports = FavouriteRestaurant;
