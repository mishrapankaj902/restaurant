const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    FirstName: { type: String },
    LastName: { type: String },
    EmailAddress: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    FireBaseId: { type: String },
    RoleId: { type: Schema.Types.ObjectId, required: true },
    Role: { type: String },
    FullName: { type: String },
    CreatedDate: Date,
    ModifiedDate: Date,
    EmailVerified: Boolean,
    PhotoUrl: String,
    SighUpMethod: String,
    SighUpDate:Date,
    UUID: { type: String },
    Subscription:String
});

// the schema is useless so far
// we need to create a model using it
var user = mongoose.model('User', userSchema);

module.exports = user;
