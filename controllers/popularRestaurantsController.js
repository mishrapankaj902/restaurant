module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
  var mongoose = require('mongoose');
  var PopularRestaurants = require('../model/PopularRestaurants');

  app.post('/api/popularRestaurantByPayment', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var SubscriptionDays = req.body.SubscriptionDays;
      var currentDate = new Date();
      var SubscriptionEndDate = currentDate.setDate(currentDate.getDate() +  parseInt(SubscriptionDays));
      PopularRestaurants.find({ RestaurantId: req.body.RestaurantId}, function (err, result) {
        if (err)
          sendError(err, res);
        else {
          if (result.length > 0) {
            var updatepopularRestaurants = new PopularRestaurants({
              RestaurantId: req.body.RestaurantId,
              UserId: req.body.UserId,
              ModifiedDate: new Date(),
              PaymentMade: req.body.PaymentMade, //  boolean value
              Amount: req.body.Amount,
              SubscriptionStartDate: new Date(),
              SubscriptionEndDate: SubscriptionEndDate,
              SubscriptionDays: SubscriptionDays
            });
            PopularRestaurants.update({ RestaurantId: req.body.RestaurantId},updatepopularRestaurants,function (err, response) {
              if (err != null) {
                sendError(err, res);
              }
              else {
                if (response != null) {
                  sendSuccessResponse(response, 'updated Successfully', res);
                }
                else {
                  sendError({ message: 'Failed to update' }, res);
                }
              }
            });
          } else {
            var popularRestaurants = new PopularRestaurants({
              _id: new mongoose.Types.ObjectId,
              RestaurantId: req.body.RestaurantId,
              UserId: req.body.UserId,
              CreatedDate: new Date(),
              ModifiedDate: new Date(),
              PaymentMade: req.body.PaymentMade, //  boolean value
              Amount: req.body.Amount,
              SubscriptionStartDate: new Date(),
              SubscriptionEndDate: SubscriptionEndDate,
              SubscriptionDays: SubscriptionDays

            });
            popularRestaurants.save(function (err, response) {
              if (err != null) {
                sendError(err, res);
              }
              else {
                if (response != null) {
                  sendSuccessResponse(response, 'saved Successfully', res);
                }
                else {
                  sendError({ message: 'Failed to save' }, res);
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

  /* To get popular restaurant : Start */
  app.get('/api/popularRestaurantByPayment', function (req, res) {
    var currentDate = new Date();
    PopularRestaurants.aggregate([
      { $match: { SubscriptionEndDate: { '$gte': currentDate } } },
      {
        $lookup:
          {
            from: "restaurants",
            localField: "RestaurantId",
            foreignField: "_id",
            as: "Restaurant"
          }
      },
      {
        $project: {
          Restaurant: "$Restaurant",
        }
      }
    ], function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    })
  });
   /* To get popular restaurant : End */
}
