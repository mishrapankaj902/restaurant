const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bookmarkSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Key: { type: String },
    FavoriteCounter: { type: Number },
    RestaurantId: { type: String },
    RestaurantName: { type: Schema.Types.ObjectId },
    CreatedDate: Date,
    ModifiedDate: Date
});

// the schema is useless so far
// we need to create a model using it
var bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = bookmark;