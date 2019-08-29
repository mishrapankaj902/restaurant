const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restaurantReviewSchema = new Schema({
    _id: Schema.Types.ObjectId,
    RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
    UserId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
    Stars: Number,
    Review: String,
    CreatedDate: Date,
    ModifiedDate: Date
});

var restaurantReview = mongoose.model('RestaurantReview', restaurantReviewSchema);

module.exports = restaurantReview;