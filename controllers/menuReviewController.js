module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
  var mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
  var MenuReview = require('../model/MenuReview');
  var Menu = require('../model/Menu');


  app.get('/api/menuReview', function (req, res) {
    var resultData = [];
    MenuReview.aggregate(
      [
        { $group: { _id: "$MenuId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
      ], function (err, result) {
        if (err)
          sendError(err, res);
        else {
          Menu.find({}, function (errRes, menu) {
            if (!errRes) {
              result.forEach(function (element) {
                resultData.push({
                  Menu: menu.filter(p => p._id == element._id.toString())[0],
                  Stars: element.Stars,
                });

              })
            }
            sendSuccessResponse(resultData, '', res);
          });

        }
      });
  });


  app.post('/api/menuReview', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var newMenuReview = new MenuReview({
        _id: new mongoose.Types.ObjectId,
        MenuId: req.body.MenuId,
        UserId: req.body.UserId,
        Stars: req.body.Stars,
        Review: req.body.Review,
        CreatedDate: new Date(),
        ModifiedDate: new Date()
      });

      newMenuReview.save(function (err, users) {
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

  app.get('/api/menu/:_id/review/stars/:_stars', function (req, res) {
    var Id = req.params._id;
    var stars = req.params._stars;
    if (stars == -1) {
      MenuReview.aggregate([
        { "$match": { "MenuId": ObjectId(Id) } },
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
    else {
      MenuReview.aggregate([
        { "$match": { "MenuId": ObjectId(Id), "Stars": parseInt(stars) } },
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


}
