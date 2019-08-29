const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tableSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Name: { type: String },
    RestaurantId: { type: Schema.Types.ObjectId },
    RestaurantName: { type: String },
    TableType: { type: String },
    Seats:Number,
    TableStatus: String,
    TableReservationDate:Date,
    CreatedDate: Date,
    ModifiedDate: Date
});

// the schema is useless so far
// we need to create a model using it
var table = mongoose.model('Table', tableSchema);

module.exports = table;
