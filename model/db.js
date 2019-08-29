// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
var dbURI = 'mongodb://localhost:27017/MijnMenu';
//var dbURI = 'mongodb://127.0.0.1:27017/MijnMenu';//134.209.87.18
//var dbURI = 'mongodb://112.196.24.205:27017/MijnMenu';

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


// BRING IN YOUR SCHEMAS & MODELS
// For example
require('./Restaurant');
require('./Menu');
require('./MenuCategory');
require('./Product');
require('./RestaurantCategory');
require('./Role');
require('./User');
require('./TableReservation');
require('./Bookmark');
require('./Orders');
require('./Image');
require('./TableType');
require('./Table');
require('./Offer');
require('./FavouriteRestaurant');
require('./PopularRestaurants');
require('./DietaryRestrictionsType');
