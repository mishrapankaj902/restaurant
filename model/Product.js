const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Name: { type: String, required: true },
    Description: { type: String },
    Quantity:Number,
    Image: { type: String },
    Price: { type: Schema.Types.Decimal128, required: true },
    CreatedDate: Date,
    ModifiedDate: Date
});

// the schema is useless so far
// we need to create a model using it
var product = mongoose.model('Product', productSchema);

module.exports = product;