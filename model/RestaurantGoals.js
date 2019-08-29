const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restaurantGoalsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    RevenueGoal: { type: Number },
    CashierGoal: { type: Number },
	CustomerGoal: { type: Number },
    RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
    Month: { type: Number },
    CreatedDate: Date,
    ModifiedDate: Date
});

var restaurantGoals = mongoose.model('RestaurantGoals', restaurantGoalsSchema);

module.exports = restaurantGoals;