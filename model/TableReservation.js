const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tableReservationSchema = new Schema({
    _id: Schema.Types.ObjectId,
    FirstName: { type: String },
    LastName: { type: String },
	  TableId:{ type: Schema.Types.ObjectId },
    UserId: { type: Schema.Types.ObjectId },
    RestaurantId: { type: Schema.Types.ObjectId },
    RestaurantName: { type: String },
    TableReservationDate: Date,
    TableReservationQuantity: Number,
    ReservationCode: String,
    VisitStatus: String,
    CreatedDate: Date,
    ModifiedDate: Date
});

// the schema is useless so far
// we need to create a model using it
var tableReservation = mongoose.model('TableReservation', tableReservationSchema);

module.exports = tableReservation;
