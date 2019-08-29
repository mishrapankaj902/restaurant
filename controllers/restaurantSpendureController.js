module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
    var mongoose = require('mongoose');
    const ObjectId = mongoose.Types.ObjectId;
    var RestaurantSpendure = require('../model/RestaurantSpendure');



    app.post('/api/restaurantspendure', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newRestaurantSpendure = new RestaurantSpendure({
                _id: new mongoose.Types.ObjectId,
                RestaurantId: req.body.RestaurantId,
                OrderId: req.body.OrderId,
                Amount: req.body.Amount,
                UserId: req.body.UserId,
                Status:req.body.Status,
                CreatedDate: new Date()
                //ModifiedDate: new Date()
            });

            newRestaurantSpendure.save(function (err, users) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (users != null) {
                        sendSuccessResponse(users, 'Added Successfully', res);
                    }
                    else {
                        sendError({ message: 'Failed to save Restaurant spendure' }, res);
                    }
                }
            });
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.get('/api/restaurant/:_id/spendure/:_date', function (req, res) {
        var Id = req.params._id;
        var _date = req.params._date;
        var resultData = [];
        var prd = [];
        RestaurantSpendure.find({ RestaurantId: Id, CreatedDate: _date }, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });

    app.get('/api/restaurant/:_id/spendure/month/:_currentMonth', function (req, res) {
        var Id = req.params._id;
        var _currentMonth = req.params._currentMonth;
        var _year = req.params._year;
        var resultData = [];
        var prd = [];
        RestaurantSpendure.aggregate(
            [
                {
                    "$project": {
                        "month": { "$month": "$CreatedDate" },
                        "Amount": "$Amount",
                        "day": { "$dayOfMonth": "$CreatedDate" },
                        "RestaurantId": "$RestaurantId"
                    }
                },
                {
                    "$match": {
                        "month": parseInt(_currentMonth),
                        "RestaurantId": ObjectId(Id)
                    }
                }, { "$sort": { 'day': 1 } }
            ], function (err, result) {
                if (err)
                    sendError(err, result);
                else {
                    sendSuccessResponse(result, '', res);
                }
            });
    });
    app.get('/api/restaurant/:_id/spendure/:_startDate/:_enddate', function (req, res) {
        var Id = req.params._id;
        var _startDate = req.params._startDate;
        var _enddate = req.params._enddate;
        var resultData = [];
        var prd = [];
        RestaurantSpendure.find({ RestaurantId: Id, CreatedDate: { '$gte': _startDate, '$lt': _enddate } }, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });

    app.get('/api/restaurant/:_id/spendureyear/:_year', function (req, res) {
        var Id = req.params._id;
        var _year = req.params._year;
        var resultData = [];
        var prd = [];
        RestaurantSpendure.aggregate(
            [
                {
                    "$project": {
                        "year": { "$year": "$CreatedDate" },
                        "Month": { "$month": "$CreatedDate" },
                        "Amount": "$Amount",
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

   
}
