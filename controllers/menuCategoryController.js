module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
    var mongoose = require('mongoose');

    var MenuCategory = require('../model/MenuCategory');

    app.get('/api/menucategory', function (req, res) {
        MenuCategory.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.get('/api/menucategory/:_id', function (req, res) {
        var Id = req.params._id;
        MenuCategory.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.post('/api/menucategory', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newMenuCategory = new MenuCategory({
                _id: new mongoose.Types.ObjectId,
                Name: req.body.Name,
                Description: req.body.Email,
                CreatedDate: new Date(),
                ModifiedDate: new Date()
            });

            newMenuCategory.save(function (err, users) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (users != null) {
                        sendSuccessResponse(users, 'Added Successfully', res);
                    }
                    else {
                        sendError({ message: 'Failed to save Menu Category' }, res);
                    }
                }
            });
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.put('/api/menucategory', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateMenuCategory = new MenuCategory();

                updateMenuCategory._id = req.body._id;
                updateMenuCategory.Name = req.body.Name;
                updateMenuCategory.Description = req.body.Description;
                updateMenuCategory.ModifiedDate = new Date();

                MenuCategory.update({ "_id": req.body._id }, updateMenuCategory, function (err, categories) {
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
                sendError({ message: 'For update menucategory _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.delete('/api/menucategory/:_id', function (req, res) {
        var Id = req.params._id;
        MenuCategory.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
    });
}
