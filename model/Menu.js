var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var menuSchema = new Schema({
    _id: Schema.Types.ObjectId,
  Name: { type: String, required: true, text: true, index: true },
    MenuCategoryId: { type: Schema.Types.ObjectId, required: true, ref: 'MenuCategory' },
    ProductId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    RestaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
    CreatedDate: Date,
    ModifiedDate: Date,
    Description: String,
    PriceDelivery: Number,
    CostExcelTax: Number,
    TaxLevel: String,
    TaxLevelTakeAway: String,
    TaxLevelDelivery: String,
    Barcode: String,
	  DiscountEvent:String,
    ReductionAmount: Number,
    RunTimeEventDate: String,
    RunTimeEventTime: String,
    RecurreningEvent: String,
    RestaurantDetail: Object,
    DietaryType: Array
});

var Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
