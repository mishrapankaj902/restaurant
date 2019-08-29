const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var menuCategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    Name: { type: String, required: true, text: true, index: true },
    Description: { type: String },
    CreatedDate: Date,
    ModifiedDate: Date
});

var menuCategory = mongoose.model('MenuCategory', menuCategorySchema);

module.exports = menuCategory;
