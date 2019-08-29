module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
    var mongoose = require('mongoose');

    var RestaurantCategory = require('../model/RestaurantCategory');

    app.get('/api/restaurantcategory', function (req, res) {
        RestaurantCategory.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.get('/api/restaurantcategory/:_id', function (req, res) {
        var Id = req.params._id;
        RestaurantCategory.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.post('/api/restaurantcategory', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newRestaurantCategory = new RestaurantCategory({
                _id: new mongoose.Types.ObjectId,
                Name: req.body.Name,
                Description: req.body.Description,
                CreatedDate: new Date(),
                ModifiedDate: new Date()
            });

            newRestaurantCategory.save(function (err, users) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (users != null) {
                        sendSuccessResponse(users, 'Added Successfully', res);
                    }
                    else {
                        sendError({ message: 'Failed to save Restaurant Category' }, res);
                    }
                }
            });
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.put('/api/restaurantcategory', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateRestaurantCategory = new RestaurantCategory();

                updateRestaurantCategory._id = req.body._id;
                updateRestaurantCategory.Name = req.body.Name;
                updateRestaurantCategory.Description = req.body.Description;
                updateRestaurantCategory.ModifiedDate = new Date();

                RestaurantCategory.update({ "_id": req.body._id }, updateRestaurantCategory, function (err, categories) {
                    if (err != null) {
                        sendError(err, res);
                    }
                    else {
                        if (categories != null) {
                            sendSuccessResponse(categories, 'Updated Successfully', res);
                        }
                        else {
                            sendError({ message: 'Failed to save restaurant' }, res);
                        }
                    }
                });
            }
            else {
                sendError({ message: 'For update Restaurant category _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.delete('/api/restaurantcategory/:_id', function (req, res) {
        var Id = req.params._id;
        RestaurantCategory.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
    });
}
