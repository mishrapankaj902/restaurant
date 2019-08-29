const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var menuReviewSchema = new Schema({
  _id: Schema.Types.ObjectId,
  MenuId: { type: Schema.Types.ObjectId, required: true, ref: 'Menus' },
  UserId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  Stars: Number,
  Review: String,
  CreatedDate: Date,
  ModifiedDate: Date
});

var menuReview = mongoose.model('MenuReview', menuReviewSchema);

module.exports = menuReview;
