const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ordersSchema = new Schema({
    _id: Schema.Types.ObjectId,
    UserId: { type: Schema.Types.ObjectId, required: true },
    OrderDetails: {
        OrderdItems:[{
            ProductId: { type: Schema.Types.ObjectId, required: true },
            ProductName: String,
            ProductPrice:{ type: Schema.Types.Decimal128 },
            ProductQty: Number,
            TableId: { type: Schema.Types.ObjectId },
            TableName: String,
            ItemStatus: String,
        }]
    },
    OrderExtras: [
       {
           ProductId: { type: Schema.Types.ObjectId, required: true },
           ProductName: String,
           ProductPrice: { type: Schema.Types.Decimal128 },
           ProductQty: Number,
           TableId: { type: Schema.Types.ObjectId },
           TableName: String,
           ItemStatus: String,
       }
    ],
    RestaurantId: { type: Schema.Types.ObjectId, required: true },
    RestaurantName: String,
    TableReservationId: { type: Schema.Types.ObjectId, required: true },
    CustomerPaymentMethod: String,
    OrderNumber:Number,
    OrderStatus: String,
    Timestamp: { type: Number, default: Date.now},
    TotalPrice: { type: Schema.Types.Decimal128 },
    ReservationCode:String,
    CreatedDate: Date,
    ModifiedDate:Date
});

// the schema is useless so far
// we need to create a model using it
var orders = mongoose.model('Orders', ordersSchema);

module.exports = orders;