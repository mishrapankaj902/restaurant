module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
    var mongoose = require('mongoose');
    const ObjectId = mongoose.Types.ObjectId;
    var RestaurantReview = require('../model/RestaurantReview');
  var Restaurant = require('../model/Restaurant');


  app.get('/api/restaurantReview', function (req, res) {
    var resultData = [];
    RestaurantReview.aggregate(
      [
        { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
      ], function (err, result) {
          if (err)
            sendError(err, res);
          else {
            Restaurant.find({}, function (errRes, restaurant) {
              if (!errRes) {
                result.forEach(function (element) {
                  resultData.push({
                    Restaurant: restaurant.filter(p => p._id == element._id.toString())[0],
                   Stars: element.Stars,
                  });
                 
                })
              }
              sendSuccessResponse(resultData, '', res);
            });
           
          }
        });
  });

  app.get('/api/restaurantReview/pageNo/:_pageNo/pageSize/:_pageSize', function (req, res) {
    var resultData = [];
    var pageNo = parseInt(req.params._pageNo);
    var pageSize = parseInt(req.params._pageSize);
    var skipParameter = pageSize * (pageNo - 1);
    RestaurantReview.aggregate(
      [
        { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }, { $skip: skipParameter }, { $limit: pageSize }
      ], function (err, result) {
        if (err)
          sendError(err, res);
        else {
          Restaurant.find({}, function (errRes, restaurant) {
            if (!errRes) {
              result.forEach(function (element) {
                resultData.push({
                  Restaurant: restaurant.filter(p => p._id == element._id.toString())[0],
                  Stars: element.Stars,
                });

              })
            }
            sendSuccessResponse(resultData, '', res);
          });

        }
      });
  });
    app.post('/api/restaurantReview', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newRestaurantReview = new RestaurantReview({
                _id: new mongoose.Types.ObjectId,
                RestaurantId: req.body.RestaurantId,
                UserId: req.body.UserId,
                Stars: req.body.Stars,
                Review: req.body.Review,
                CreatedDate: new Date()
                //ModifiedDate: new Date()
            });

            newRestaurantReview.save(function (err, users) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (users != null) {
                        sendSuccessResponse(users, 'Added Successfully', res);
                    }
                    else {
                        sendError({ message: 'Failed to save Restaurant Review' }, res);
                    }
                }
            });
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.get('/api/restaurant/:_id/review/stars/:_stars', function (req, res) {
        var Id = req.params._id;
        var stars = req.params._stars;
        if (stars == -1) {
            RestaurantReview.aggregate([
       { "$match": { "RestaurantId": ObjectId(Id) } },
       { "$sort": { 'CreatedDate': -1 } }
            ], function (err, result) {
                if (err)
                    sendError(err, res);
                else {
                    sendSuccessResponse(result, '', res);
                }
            });
        }
        else {
            RestaurantReview.aggregate([
       { "$match": { "RestaurantId": ObjectId(Id), "Stars": parseInt(stars) } },
       {
           $lookup:
           {
               from: 'users',
               localField: 'UserId',
               foreignField: '_id',
               as: 'userdetails'
           }
       }, { "$sort": { 'CreatedDate': -1 } }
            ], function (err, result) {
                if (err)
                    sendError(err, res);
                else {
                    sendSuccessResponse(result, '', res);
                }
            });
        }
       
  });

  /* API TO GET AVERAGE RATINGS OF RESTAURANT : START */
  app.get('/api/restaurantReview/restaurant/:_id', function (req, res) {
    var Id = req.params._id;
    var resultData = [];
    RestaurantReview.aggregate(
      [
        { "$match": { "RestaurantId": ObjectId(Id)} },
        { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
      ], function (err, result) {
          if (err)
            sendError(err, res);
          else {
            Restaurant.find({}, function (errRes, restaurant) {
              if (!errRes) {
                result.forEach(function (element) {
                  resultData.push({
                    Restaurant: restaurant.filter(p => p._id == element._id.toString())[0],
                   Stars: element.Stars,
                  });
                 
                })
              }
              sendSuccessResponse(resultData, '', res);
            });
           
          }
        });
  });
  /* API TO GET AVERAGE RATINGS OF RESTAURANT : END */
    
}
