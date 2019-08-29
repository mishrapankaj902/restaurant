const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restuarantCategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    Name: { type: String, required: true },
    Description: { type: String },
    CreatedDate: Date,
    ModifiedDate: Date
});

var restuarantCategory = mongoose.model('RestaurantCategory', restuarantCategorySchema);

module.exports = restuarantCategory;