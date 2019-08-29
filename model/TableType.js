const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tableTypeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Type: { type: String }
});

// the schema is useless so far
// we need to create a model using it
var tableType = mongoose.model('TableType', tableTypeSchema);

module.exports = tableType;