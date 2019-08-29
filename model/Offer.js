const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var offerSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Title:String,
    Description: String,
    StartDate: Date,
    EndDate: Date,
    ProductId: { type: Schema.Types.ObjectId, required: true },
    ProductQty: Number,
    Discount: Number,
    RestaurantId: { type: Schema.Types.ObjectId, required: true },
    CreatedDate: Date,
    ModifiedDate: Date
});

// the schema is useless so far
// we need to create a model using it
var order = mongoose.model('Offer', offerSchema);

module.exports = order;
