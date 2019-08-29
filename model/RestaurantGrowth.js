const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restaurantGrowthSchema = new Schema({
    _id: Schema.Types.ObjectId,
    RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
    OrderId: { type: Schema.Types.ObjectId, required: true, ref: 'Orders' },
    Amount: { type: Number },
    UserId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
    Status: String,
    CreatedDate: Date,
    ModifiedDate: Date
});

var restaurantGrowth = mongoose.model('RestaurantGrowth', restaurantGrowthSchema);

module.exports = restaurantGrowth;