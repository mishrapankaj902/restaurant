module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
    var mongoose = require('mongoose');
    const stringify = require('json-stringify-safe')

    var Offer = require('../model/Offer');
    var Product = require('../model/Product');
    var Restaurant = require('../model/Restaurant');

    app.get('/api/offer', function (req, res) {
        var resultData = [];
        var prd = [];
        Offer.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                Product.find({}, function (err, products) {
                    if (!err) {
                        Restaurant.find({}, function (err, restaurant) {
                            if (!err) {
                                result.forEach(function (element) {
                                    resultData.push({
                                        Offer: element,
                                        Product: products.filter(p=>p._id == element.ProductId.toString())[0],
                                        Restaurant: restaurant.filter(p=>p._id == element.RestaurantId.toString())[0]
                                    })
                                })
                                sendSuccessResponse(resultData, '', res);
                            }
                            else
                                sendError(err, res);
                        });
                    }
                    else
                        sendError(err, res);
                });
            }
        });
    });

    //app.get('/api/restaurant/:_id/date/:_date/offer', function (req, res) {
    //  var Id = req.params._id;
    //  var date = req.params._date;
    //  var offer = req.params.offer;
    //    var resultData = [];
    //    var prd = [];
    //  Offer.find({ RestaurantId: Id, StartDate: { '$gte': _startDate, '$lt': _enddate } }, function (err, result) {
    //        if (err)
    //            sendError(err, res);

    //        else {
    //            Product.find({}, function (err, products) {
    //                if (!err) {
    //                    Restaurant.find({}, function (err, restaurant) {
    //                        if (!err) {
    //                            result.forEach(function (element) {
    //                                resultData.push({
    //                                    Offer: element,
    //                                    Product: products.filter(p=>p._id == element.ProductId.toString())[0],
    //                                    Restaurant: restaurant.filter(p=>p._id == element.RestaurantId.toString())[0]
    //                                })
    //                            })
    //                            sendSuccessResponse(resultData, '', res);
    //                        }
    //                        else
    //                            sendError(err, res);
    //                    });
    //                }
    //                else
    //                    sendError(err, res);
    //            });
    //        }
    //    });
    //});


    app.get('/api/offer/:_id', function (req, res) {
        var Id = req.params._id;
        resultData = {};
        Offer.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                Product.find({}, function (err, products) {
                    if (!err) {
                        Restaurant.find({}, function (err, restaurant) {
                            if (!err) {
                                if (!err) {
                                    resultData.Offer = res[0];
                                    resultData.Product = products.filter(p=>p._id == res[0].ProductId.toString())[0];
                                    resultData.Restaurant = restaurant.filter(p=>p._id == res[0].RestaurantId.toString())[0];
                                }
                                sendSuccessResponse(resultData, '', res);
                            }
                            else
                                sendError(err, res);
                        });
                    }
                    else
                        sendError(err, res);
                });
        });
    });

  app.post('/api/offer', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newOffer = new Offer({
                _id: new mongoose.Types.ObjectId,
                Title: req.body.Title,
                Description: req.body.Description,
                StartDate: req.body.StartDate,
                EndDate: req.body.EndDate,
                ProductId: req.body.ProductId,
                ProductQty: req.body.ProductQty,
                Discount: req.body.Discount,
                RestaurantId: req.body.RestaurantId,
                CreatedDate: new Date(),
                ModifiedDate: new Date()
            });

            newOffer.save(function (err, offers) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                  if (offers != null) {
                    sendSuccessResponse(offers, 'Added Successfully', res);
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

  app.put('/api/offer', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateOffer = new Offer();

                updateOffer._id = req.body._id;
                updateOffer.Title = req.body.Title;
                updateOffer.Description = req.body.Description;
                updateOffer.StartDate = req.body.StartDate;
                updateOffer.EndDate = req.body.EndDate;
                updateOffer.ProductId = req.body.ProductId; 
                updateOffer.ProductQty = req.body.ProductQty;
                updateOffer.Discount = req.body.Discount;
                updateOffer.RestaurantId = req.body.RestaurantId;
                updateOffer.ModifiedDate = new Date();

                Offer.update({ "_id": req.body._id }, updateOffer, function (err, categories) {
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
                sendError({ message: 'For update menu _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.delete('/api/offer/:_id', function (req, res) {
        var Id = req.params._id;
        Offer.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
  });
  /* To get offers based upon restaurants based upon date: Start */
  app.get('/api/restaurant/:_id/offer', function (req, res) {
    var Id = req.params._id;
    var date = new Date();
    var resultData = [];
    var prd = [];
    Offer.find({
      RestaurantId: Id, EndDate: { '$gte': date }
    }, function (err, result) {
      if (err)
        sendError(err, res);

      else {
        Product.find({}, function (err, products) {
          if (!err) {
            Restaurant.find({}, function (err, restaurant) {
              if (!err) {
                result.forEach(function (element) {
                  resultData.push({
                    Offer: element,
                    Product: products.filter(p => p._id == element.ProductId.toString())[0],
                    Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())[0]
                  })
                })
                sendSuccessResponse(resultData, '', res);
              }
              else
                sendError(err, res);
            });
          }
          else
            sendError(err, res);
        });
      }
    });
  });
  /* To get offers based upon restaurants based upon date : End */
}
