const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roleSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Role: { type: String, required: true }
});

// the schema is useless so far
// we need to create a model using it
var role = mongoose.model('Role', roleSchema);

// make this available to our restaurant in our Node applications
module.exports = role;