const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dietaryRestrictionsTypeSchema = new Schema({
  _id: Schema.Types.ObjectId,
  DietaryName: { type: String, required: true },
  DietaryValue: { type: Number, required: true },
  CreatedDate: Date,
  ModifiedDate: Date
});

var DietaryRestrictionsTypes = mongoose.model('DietaryRestrictionsType', dietaryRestrictionsTypeSchema);

module.exports = DietaryRestrictionsTypes;
