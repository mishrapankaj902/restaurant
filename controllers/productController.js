module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
    var mongoose = require('mongoose');

    var Product = require('../model/Product');

    app.get('/api/product', function (req, res) {
        Product.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.get('/api/product/:_id', function (req, res) {
        var Id = req.params._id;
        Product.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.post('/api/product', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newProduct = new Product({
                _id: new mongoose.Types.ObjectId,
                Name: req.body.Name,
                Description: req.body.Description,
                Quantity: req.body.Quantity,
                Image: req.body.Image,
                Price: req.body.Price,
                CreatedDate: new Date(),
                ModifiedDate: new Date()
            });

            newProduct.save(function (err, users) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (users != null) {
                        sendSuccessResponse(users, 'Added Successfully', res);
                    }
                    else {
                        sendError({ message: 'Failed to save product' }, res);
                    }
                }
            });
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.put('/api/product', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateProduct = new Product();

                updateProduct._id = req.body._id;
                updateProduct.Name = req.body.Name;
                updateProduct.Description = req.body.Description;
                updateProduct.Quantity = req.body.Quantity;
                updateProduct.Image = req.body.Image;
                updateProduct.Price = req.body.Price;
                updateProduct.ModifiedDate = new Date();


                Product.update({ "_id": req.body._id }, updateMenu, function (err, categories) {
                    if (err != null) {
                        sendError(err, res);
                    }
                    else {
                        if (categories != null) {
                            sendSuccessResponse(categories, 'Updated Successfully', res);
                        }
                        else {
                            sendError({ message: 'Failed to save Product' }, res);
                        }
                    }
                });
            }
            else {
                sendError({ message: 'For update Product _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.delete('/api/product/:_id', function (req, res) {
        var Id = req.params._id;
        Product.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
    });
}
