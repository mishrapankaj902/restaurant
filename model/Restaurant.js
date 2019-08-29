var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  _id: Schema.Types.ObjectId,
  Name: { type: String, required: true, text: true, index:true },
    Address: String,
    City: String,
    Description: String,
    DisNationality: String,
    DishType: String,
    Images:[
        {
            Id:Schema.Types.ObjectId,
            Path:String
        }
    ],
    Label: String,
    Lat: Number,
    Long: Number,
    Picture: String,
    Rating: Number,
    Reviews: [String],
    State: String,
    Tags: String,
    ThumbNail: String,
    Title: String,
    Zip: String,
    Price: { type: Schema.Types.Decimal128},
    Email: { type: String, required: true},
    RestaurantCategoryId: { type: Schema.Types.ObjectId, required: true },
    RestaurantCategoryName: String,
    StripeId: String,
    UserId: { type: Schema.Types.ObjectId, required: true },
    PhoneNumber: Number,
    CreatedDate: Date,
    ModifiedDate: Date,
    OpeningTime: String,
    ClosingTime: String,
    TotalSeats: Number,
    AvalibaleSeats: Number,
  Distance: Number,
  DietaryType: Array
});

// the schema is useless so far
// we need to create a model using it
var Restaurant = mongoose.model('Restaurant', restaurantSchema);

// make this available to our restaurant in our Node applications
module.exports = Restaurant;
