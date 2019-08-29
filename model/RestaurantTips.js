const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restaurantTipsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    TipAmount: { type: Number },
    GivenByUserId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
    OrderId: { type: Schema.Types.ObjectId, required: true, ref: 'Orders' },
    RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
    RecievedByStaffId:{type:Number},
    Month: { type: Number },
    CreatedDate: Date,
    ModifiedDate: Date
});

var restaurantTips = mongoose.model('RestaurantTips', restaurantTipsSchema);

module.exports = restaurantTips;