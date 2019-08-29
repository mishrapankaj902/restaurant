const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    EntityType: { type: String },
    EntityId: Schema.Types.ObjectId,
    Name: { type: String },
    Path: { type: String },
    CreatedDate: Date,
    ModifiedDate: Date
});

// the schema is useless so far
// we need to create a model using it
var image = mongoose.model('Image', imageSchema);

module.exports = image;