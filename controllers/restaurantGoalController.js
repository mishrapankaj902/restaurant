module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
    var mongoose = require('mongoose');

    var RestaurantGoals = require('../model/RestaurantGoals');



    app.post('/api/restaurantgoals', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newRestaurantGoals = new RestaurantGoals({
                _id: new mongoose.Types.ObjectId,
                RevenueGoal: req.body.RevenueGoal,
                CashierGoal: req.body.CashierGoal,
                CustomerGoal: req.body.CustomerGoal,
                RestaurantId: req.body.RestaurantId,
                Month: req.body.Month,
                CreatedDate: new Date(),
                ModifiedDate: new Date()
            });

            newRestaurantGoals.save(function (err, users) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (users != null) {
                        sendSuccessResponse(users, 'Added Successfully', res);
                    }
                    else {
                        sendError({ message: 'Failed to save Restaurant Goal' }, res);
                    }
                }
            });
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.get('/api/restaurant/:_id/goals/:_currentMonth', function (req, res) {
        var Id = req.params._id;
        var _currentMonth = req.params._currentMonth;
        var resultData = [];
        var prd = [];
        RestaurantGoals.find({ RestaurantId: Id, Month: _currentMonth }, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });
    app.put('/api/restaurantgoals', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateRestaurantGoal = new RestaurantGoals();

                updateRestaurantGoal._id = req.body._id;
                updateRestaurantGoal.RevenueGoal = req.body.RevenueGoal,
                updateRestaurantGoal.CashierGoal = req.body.CashierGoal,
                updateRestaurantGoal.CustomerGoal = req.body.CustomerGoal,
                updateRestaurantGoal.ModifiedDate = new Date();

                RestaurantGoals.update({ "_id": req.body._id }, updateRestaurantGoal, function (err, goals) {
                    if (err != null) {
                        sendError(err, res);
                    }
                    else {
                        if (goals != null) {
                            sendSuccessResponse(goals, 'Updated Successfully', res);
                        }
                        else {
                            sendError({ message: 'Failed to save restaurant' }, res);
                        }
                    }
                });
            }
            else {
                sendError({ message: 'For update Restaurant Goal _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });
}
