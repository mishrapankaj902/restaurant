module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
  var mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
  var RestaurantTips = require('../model/RestaurantTips');
  var Table = require('../model/Table');


  app.post('/api/restauranttips', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var newRestaurantTips = new RestaurantTips({
        _id: new mongoose.Types.ObjectId,
        TipAmount: req.body.TipAmount,
        GivenByUserId: req.body.GivenByUserId,
        OrderId: req.body.OrderId,
        RestaurantId: req.body.RestaurantId,
        RecievedByStaffId: req.body.RecievedByStaffId,
        Month: req.body.Month,
        CreatedDate: new Date()
        // ModifiedDate: new Date()
      });

      newRestaurantTips.save(function (err, users) {
        if (err != null) {
          sendError(err, res);
        }
        else {
          if (users != null) {
            Table.update(
              { "_id": tableId, RestaurantId: req.body.RestaurantId },
              { $set: { "TableStatus": "Vacant", TableReservationDate:null } }, function (err, result) {
                if (err != null) {
                  sendError(err, res);
                }
                else {
                  sendSuccessResponse(users, 'Added Successfully', res);
                }
              }
            );
            // sendSuccessResponse(users, 'Added Successfully', res);
          }
          else {
            sendError({ message: 'Failed to save Restaurant Tips' }, res);
          }
        }
      });
    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });

  app.get('/api/restaurant/:_id/tips/:_date', function (req, res) {
    var Id = req.params._id;
    var _date = req.params._date;
    var resultData = [];
    var prd = [];
    RestaurantTips.find({ RestaurantId: Id, CreatedDate: _date }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });

  app.get('/api/restaurant/:_id/tips/month/:_currentMonth', function (req, res) {
    var Id = req.params._id;
    var _currentMonth = req.params._currentMonth;
    var resultData = [];
    var prd = [];
    RestaurantTips.find({ RestaurantId: Id, Month: _currentMonth }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });
  app.get('/api/restaurant/:_id/tips/:_startDate/:_enddate', function (req, res) {
    
    var Id = req.params._id;
    var _startDate = req.params._startDate;
    var _enddate = req.params._enddate;
    var resultData = [];
    var prd = [];
    RestaurantTips.find({ RestaurantId: Id, CreatedDate: { '$gte': _startDate, '$lt': _enddate } }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        console.log(result);
        sendSuccessResponse(result, '', res);
      }
    });
  });

  app.get('/api/restaurant/:_id/tipsyear/:_year', function (req, res) {
    var Id = req.params._id;
    var _year = req.params._year;
    var resultData = [];
    var prd = [];
    RestaurantTips.aggregate(
      [
        {
          "$project": {
            "year": { "$year": "$CreatedDate" },
            "Month": { "$month": "$CreatedDate" },
            "TipAmount": "$TipAmount",
            "RestaurantId": "$RestaurantId"
          }
        },
        {
          "$match": {
            "year": parseInt(_year),
            "RestaurantId": ObjectId(Id)
          }
        }
      ], function (err, result) {
        if (err)
          sendError(err, result);
        else {
          sendSuccessResponse(result, '', res);
        }
      });

  });

  app.put('/api/restauranttips', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {

      if (req.body._id != null && req.body._id != undefined && req.body._id != '') {
        var tableId = req.body.TableId;
        var updateRestaurantTips = new RestaurantTips();

        updateRestaurantTips._id = req.body._id;
        updateRestaurantTips.TipAmount = req.body.TipAmount,
        updateRestaurantTips.GivenByUserId = req.body.GivenByUserId,
        updateRestaurantTips.OrderId = req.body.OrderId,
        updateRestaurantTips.RecievedByStaffId = req.body.RecievedByStaffId,
        updateRestaurantTips.ModifiedDate = new Date();

        RestaurantTips.update({ "_id": req.body._id }, updateRestaurantTips, function (err, tips) {
          if (err != null) {
            sendError(err, res);
          }
          else {
            if (tips != null) {
              Table.update(
                { "_id": tableId, RestaurantId: req.body.RestaurantId },
                { $set: { "TableStatus": "Vacant" } }, function (err, result) {
                  if (err != null) {
                    sendError(err, res);
                  }
                  else {
                    sendSuccessResponse(tips, 'Updated Successfully', res);
                  }
                }
              );
              //Table.find({ "_id": tableId, RestaurantId: req.body.RestaurantId }, function (err, table) {
              //});
              sendSuccessResponse(tips, 'Updated Successfully', res);
            }
            else {
              sendError({ message: 'Failed to save restaurant' }, res);
            }
          }
        });
      }
      else {
        sendError({ message: 'For update Restaurant Tips _id is required' }, res);
      }

    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });
}
