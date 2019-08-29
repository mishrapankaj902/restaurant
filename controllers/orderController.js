module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
  var mongoose = require('mongoose');
  const stringify = require('json-stringify-safe')
  const ObjectId = mongoose.Types.ObjectId;
  var Order = require('../model/Orders');
  var TableReservation = require('../model/TableReservation');
  var Restaurant = require('../model/Restaurant');

  app.get('/api/order', function (req, res) {
    Order.find({}, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });

  app.get('/api/restaurant/:_id/Order', function (req, res) {
    var Id = req.params._id;
    Order.find({ RestaurantId: Id }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });

  app.get('/api/order/:_id', function (req, res) {
    var Id = req.params._id;
    Order.find({ _id: Id }, function (err, result) {
      if (err)
        sendError(err, res);
      else
        sendSuccessResponse(result[0], '', res);
    });
  });

  app.get('/api/Order/user/:_userid/restaurant/:_restaurantid', function (req, res) {
    var userId = req.params._userid;
    var restaurantId = req.params._restaurantid;
    Order.find({ UserId: userId, RestaurantId: restaurantId }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });
  app.get('/api/Order/user/:_userid/tableid/:_tableid/restaurant/:_restaurantid/code/:_reservationCode', function (req, res) {
    var userId = req.params._userid;
    var tableId = req.params._tableid;
    var reservationCode = req.params._reservationCode;
    var restaurantId = req.params._restaurantid;
    Order.find({ UserId: userId, TableId: ObjectId(tableId), RestaurantId: restaurantId, ReservationCode: reservationCode }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });

  app.get('/api/Order/tableid/:_tableid', function (req, res) {
    var tableId = req.params._tableid;
    Order.find({ TableId: ObjectId(tableId) }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });

  app.get('/api/Order/user/:_id', function (req, res) {
    var Id = req.params._id;
    Order.find({ UserId: Id }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }
    });
  });

  app.post('/api/order', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var a = req.body.OrderExtras;
      console.log("req.body.OrderStatus:" + req.body.OrderStatus);
      var newOrder = new Order({
        _id: new mongoose.Types.ObjectId,
        UserId: req.body.UserId,
        TableReservationId: req.body.TableReservationId,
        OrderDetails: req.body.OrderDetails,
        OrderExtras: req.body.OrderExtras,
        RestaurantId: req.body.RestaurantId,
        RestaurantName: req.body.RestaurantName,
        CustomerPaymentMethod: req.body.CustomerPaymentMethod,
        OrderStatus: req.body.OrderStatus,
        TimestNumber: req.body.OrderNumber,
        Orderamp: new Date(),
        TotalPrice: req.body.TotalPrice,
        ReservationCode: req.body.ReservationCode,
        CreatedDate: new Date(),
        ModifiedDate: new Date()
      });

      newOrder.save(function (err, users) {
        if (err != null) {
          sendError(err, res);
        }
        else {
          if (users != null) {
            var updateTableReservation = new TableReservation();
            TableReservation.find({ _id: req.body.TableReservationId }, function (err, result) {
              if (err)
                sendError(err, res);
              else {
                if (result.data) {
                  TableReservation.update(
                    { _id: req.body.TableReservationId },
                    { $set: { "VisitStatus": "checkedin" } }, function (err, result) {
                      sendSuccessResponse(users, 'Added Successfully', res);
                    }
                  );
                } else {
                  sendSuccessResponse(users, 'Added Successfully', res);
                }

              }
            });
            
          }
          else {
            sendError({ message: 'Failed to save order Category' }, res);
          }
        }
      });
    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });

  app.put('/api/order', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {

      if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

        var updateOrder = new Order();

        updateOrder._id = req.body._id;
        updateOrder.UserId = req.body.UserId;
        updateOrder.OrderDetails = req.body.OrderDetails;
        updateOrder.OrderExtras = req.body.OrderExtras;
        updateOrder.RestaurantId = req.body.RestaurantId;
        updateOrder.RestaurantName = req.body.RestaurantName;
        updateOrder.CustomerPaymentMethod = req.body.CustomerPaymentMethod;
        updateOrder.OrderNumber = req.body.OrderNumber;
        updateOrder.OrderStatus = req.body.OrderStatus;
        updateOrder.Timestamp = new Date();
        updateOrder.TotalPrice = req.body.TotalPrice;
        updateOrder.ModifiedDate = new Date()

        Order.update({ "_id": req.body._id }, updateOrder, function (err, order) {
          if (err != null) {
            sendError(err, res);
          }
          else {
            if (order != null) {
              sendSuccessResponse(order, 'Updated Successfully', res);
            }
            else {
              sendError({ message: 'Failed to save order' }, res);
            }
          }
        });
      }
      else {
        sendError({ message: 'For update order _id is required' }, res);
      }

    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });

  app.put('/api/order/updatestatus', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {

      if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

        var updateOrder = new Order();
        updateOrder._id = req.body._id;
        updateOrder.OrderStatus = req.body.OrderStatus;
        updateOrder.ModifiedDate = new Date()

        Order.update({ "_id": req.body._id }, {
          $set: {
            "OrderStatus": req.body.OrderStatus,
            "ModifiedDate": new Date()
          }
        }, function (err, order) {
          if (err != null) {
            sendError(err, res);
          }
          else {
            if (order != null) {
              sendSuccessResponse(order, 'Updated Successfully', res);
            }
            else {
              sendError({ message: 'Failed to save order' }, res);
            }
          }
        });
      }
      else {
        sendError({ message: 'For update order _id is required' }, res);
      }

    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });

  app.put('/api/order/updateitemstatus', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {

      if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

        var Id = req.body._id;
        Order.find({ _id: Id }, function (err, result) {
          if (err)
            sendError(err, res);
          else {

            var updateOrder = result[0];
            if (updateOrder.OrderDetails != null) {
              if (updateOrder.OrderDetails.OrderdItems != null) {
                updateOrder.OrderDetails.OrderdItems.forEach(function (element) {
                  if (element._id == req.body.ItemId)
                    element.ItemStatus = req.body.OrderStatus
                })
              }
            }
            updateOrder.ModifiedDate = new Date()

            Order.update({ "_id": req.body._id }, updateOrder, function (err, order) {
              if (err != null) {
                sendError(err, res);
              }
              else {
                if (order != null) {
                  sendSuccessResponse(order, 'Updated Successfully', res);
                }
                else {
                  sendError({ message: 'Failed to save order' }, res);
                }
              }
            });
          }
        });
      }
      else {
        sendError({ message: 'For update order _id is required' }, res);
      }

    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });

  app.delete('/api/order/:_id', function (req, res) {
    var Id = req.params._id;
    Order.findOneAndDelete({ _id: Id }, function (err, result) {
      if (err)
        sendError(err, res);
      else
        sendSuccessResponse(result, 'Deleted Successfully', res);
    });
  });

  app.post('/api/orderfromCode', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var code = req.params.ReservationCode;
      TableReservation.find({ ReservationCode: code }, function (err, result) {
        if (err)
          sendError(err, res);
        else {
          sendSuccessResponse(result, '', res);
        }
      });
    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });
  app.get('/api/RestaurantsByOrder', function (req, res) {
    var resultData = [];
    var enddate = new Date();
    var startDate = enddate.toLocaleDateString()
    startDate = new Date(startDate);
    Order.aggregate(
      [
        { "$match": { CreatedDate: { $gt: startDate, $lt: enddate } } },
        {
          $group: {
            _id: "$RestaurantId", createdDate: { $push: "$CreatedDate" }, "orderItemcount": {
              "$sum": { "$size": "$OrderDetails.OrderdItems" }
            }
          }
        }, { $sort: { orderItemcount: -1 } }

      ], function (err, result) {
        if (err)
          sendError(err, res);
        else {
          Restaurant.find({}, function (errRes, restaurant) {
            if (!errRes) {
              result.forEach(function (element) {
                resultData.push({
                  Restaurant: restaurant.filter(p => p._id == element._id.toString())[0],
                  orderItemcount: element.orderItemcount,
                });
              })
            }
            sendSuccessResponse(resultData, '', res);
          });
        }
      });
  });

  app.get('/api/RestaurantsByVisitors', function (req, res) {
    var resultData = [];
    Order.aggregate(
      [
        {
          $group: {
            _id: "$RestaurantId", "VisitorCount": { "$sum": 1 }
          }
        }, { $sort: { ordercount: -1 } }

      ], function (err, result) {
        if (err)
          sendError(err, res);
        else {
          Restaurant.find({}, function (errRes, restaurant) {
            if (!errRes) {
              result.forEach(function (element) {
                resultData.push({
                  Restaurant: restaurant.filter(p => p._id == element._id.toString())[0],
                  VisitorCount: element.VisitorCount,
                });

              })
            }
            sendSuccessResponse(resultData, '', res);
          });

        }
      });
  });
  app.get('/api/RestaurantsByOrder/pageNo/:_pageNo/pageSize/:_pageSize', function (req, res) {
    var resultData = [];
    var enddate = new Date();
    var startDate = enddate.toLocaleDateString()
    startDate = new Date(startDate);
    var pageNo = parseInt(req.params._pageNo);
    var pageSize = parseInt(req.params._pageSize);
    var skipParameter = pageSize * (pageNo - 1);
    Order.aggregate(
      [
        { "$match": { CreatedDate: { $gt: startDate, $lt: enddate } } },
        {
          $group: {
            _id: "$RestaurantId", createdDate: { $push: "$CreatedDate" }, "orderItemcount": {
              "$sum": { "$size": "$OrderDetails.OrderdItems" }
            }
          }
        }, { $sort: { orderItemcount: -1 } }, { $skip: skipParameter }, { $limit: pageSize }

      ], function (err, result) {
        if (err)
          sendError(err, res);
        else {
          Restaurant.find({}, function (errRes, restaurant) {
            if (!errRes) {
              result.forEach(function (element) {
                resultData.push({
                  Restaurant: restaurant.filter(p => p._id == element._id.toString())[0],
                  orderItemcount: element.orderItemcount,
                });

              })
            }
            sendSuccessResponse(resultData, '', res);
          });

        }
      });
  });

  app.get('/api/RestaurantsByVisitors/pageNo/:_pageNo/pageSize/:_pageSize', function (req, res) {
    var pageNo = parseInt(req.params._pageNo);
    var pageSize = parseInt(req.params._pageSize);
    var skipParameter = pageSize * (pageNo - 1);
    var resultData = [];
    Order.aggregate(
      [
        {
          $group: {
            _id: "$RestaurantId", "VisitorCount": { "$sum": 1 }
          }
        }, { $sort: { ordercount: -1 } }, { $skip: skipParameter }, { $limit: pageSize }

      ], function (err, result) {
        if (err)
          sendError(err, res);
        else {
          Restaurant.find({}, function (errRes, restaurant) {
            if (!errRes) {
              result.forEach(function (element) {
                resultData.push({
                  Restaurant: restaurant.filter(p => p._id == element._id.toString())[0],
                  VisitorCount: element.VisitorCount,
                });

              })
            }
            sendSuccessResponse(resultData, '', res);
          });
        }
      })
  });
}
