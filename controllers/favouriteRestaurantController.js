module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
  var mongoose = require('mongoose');
  var FavouriteRestaurant = require('../model/FavouriteRestaurant');

  app.post('/api/favouriteRestaurant', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var favRestaurant = new FavouriteRestaurant({
        _id: new mongoose.Types.ObjectId,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        UserId: req.body.UserId,
        RestaurantName: req.body.RestaurantName,
        RestaurantId: req.body.RestaurantId,
        CreatedDate: new Date(),
        ModifiedDate: new Date(),

      });
      FavouriteRestaurant.find({ RestaurantId: req.body.RestaurantId, UserId: req.body.UserId }, function (err, result) {
        if (err)
          sendError(err, res);
        else {
          if (result.length > 0 ) {
            sendSuccessResponse(result, 'Already a favourite restaurant', res);
          } else {
            favRestaurant.save(function (err, response) {
              if (err != null) {
                sendError(err, res);
              }
              else {
                if (response != null) {
                  sendSuccessResponse(response, 'Favourite Restaurant saved Successfully', res);
                }
                else {
                  sendError({ message: 'Failed to save favourite restaurant' }, res);
                }
              }
            });
          }
        }

      });
    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });
  app.get('/api/favouriteRestaurant/:_userId', function (req, res) {
    var userId = req.params._userId;
  
    FavouriteRestaurant.find({ UserId: userId }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });
  /* To find all enteries of favourite restaurant : Start */
  app.get('/api/favouriteRestaurant', function (req, res) {
    FavouriteRestaurant.find(function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });
   /* To find all enteries of favourite restaurant : End */
  app.delete('/api/favouriteRestaurant/restaurantId/:_id/userId/:_userId', function (req, res) {
    var restaurantId = req.params._id;
    var userId = req.params._userId;
    FavouriteRestaurant.findOneAndDelete({ RestaurantId: restaurantId, UserId: userId}, function (err, result) {
      if (err)
        sendError(err, res);
      else
        sendSuccessResponse(result, 'Deleted Successfully', res);
    });
  });
}
