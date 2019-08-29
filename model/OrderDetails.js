const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderDetailsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    OrderId: [Schema.Types.ObjectId],
    OrderItems:[],
    Quantity:Number,
    CreatedDate: Date,
    ModifiedDate: Date
});

// the schema is useless so far
// we need to create a model using it
var orderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

module.exports = orderDetails;
