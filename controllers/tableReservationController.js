module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
    var mongoose = require('mongoose');
    var randomstring = require("randomstring");
    const stringify = require('json-stringify-safe')
    var Table = require('../model/Table');
    var TableReservation = require('../model/TableReservation');

    app.get('/api/tableReservation', function (req, res) {
        TableReservation.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });

    app.get('/api/restaurant/:_id/tableReservation', function (req, res) {
        var Id = req.params._id;
        TableReservation.find({ RestaurantId: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });

    app.get('/api/tableReservation/:_id', function (req, res) {
        var Id = req.params._id;
        TableReservation.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result[0], '', res);
        });
    });

    app.post('/api/tableReservation', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var code = randomstring.generate({
                length: 11,
                capitalization: 'uppercase'
          });
            var newTable = new TableReservation({
                _id: new mongoose.Types.ObjectId,
                FirstName: req.body.FirstName,
                ReservationCode: code,
                LastName: req.body.LastName,
                TableId: req.body.TableId,
                UserId: req.body.UserId,
                RestaurantId: req.body.RestaurantId,
                RestaurantName: req.body.RestaurantName,
                TableReservationQuantity: req.body.TableReservationQuantity,
                TableReservationDate: req.body.TableReservationDate,
                CreatedDate: new Date(),
                ModifiedDate: new Date()
            });
          newTable.save(function (err, newReservation) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (newReservation != null) {
                        var updateTable = new Table();
                        updateTable._id = req.body.TableId;
                        updateTable.TableStatus = "Reserved";
                      updateTable.TableReservationDate = req.body.TableReservationDate;
                        updateTable.ModifiedDate = new Date()

                        Table.update({ "_id": updateTable._id }, updateTable, function (err, table) {
                            if (err != null) {
                                sendError(err, res);
                            }
                            else {
                                if (table != null) {
                                    sendSuccessResponse(newReservation, 'Added Successfully', res);
                                }
                                else {
                                    sendError({ message: 'Failed to update table' }, res);
                                }
                            }
                        });

                    }
                    else {
                        sendError({ message: 'Failed to save Table Category' }, res);
                    }
                }
            });
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

  app.put('/api/tableReservation', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateTable = new TableReservation();

                updateTable._id = req.body._id;
                updateTable.FirstName = req.body.FirstName;
                updateTable.LastName = req.body.LastName;
                updateTable.TableId = req.body.TableId;
                updateTable.UserId = req.body.UserId;
                updateTable.RestaurantId = req.body.RestaurantId;
                updateTable.RestaurantName = req.body.RestaurantName;
                updateTable.TableReservationDate = req.body.TableReservationDate;
                updateTable.TableReservationQuantity = req.body.TableReservationQuantity;
                updateTable.ModifiedDate = new Date()
                TableReservation.update({ "_id": req.body._id }, updateTable, function (err, table) {
                    if (err != null) {
                        sendError(err, res);
                    }
                    else {
                        if (table != null) {
                            var updateTable = new Table();
                            updateTable._id = req.body.TableId;
                            updateTable.TableReservationDate = req.body.TableReservationDate;
                            updateTable.TableStatus = "Reserved";
                            updateTable.ModifiedDate = new Date()

                            Table.update({ "_id": updateTable._id }, updateTable, function (err, table) {
                                if (err != null) {
                                    sendError(err, res);
                                }
                                else {
                                    if (table != null) {
                                        sendSuccessResponse(table, 'Updated Successfully', res);
                                    }
                                    else {
                                        sendError({ message: 'Failed to save table' }, res);
                                    }
                                }
                            });
                        }
                        else {
                            sendError({ message: 'Failed to save Table' }, res);
                        }
                    }
                });
            }
            else {
                sendError({ message: 'For update Table _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.put('/api/tableReservation/updatequantity', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateTable = new TableReservation();

                updateTable._id = req.body._id;
                updateTable.TableReservationQuantity = req.body.TableReservationQuantity;
                updateTable.ModifiedDate = new Date()

                TableReservation.update({ "_id": req.body._id }, updateTable, function (err, table) {
                    if (err != null) {
                        sendError(err, res);
                    }
                    else {
                        if (table != null) {
                            sendSuccessResponse(table, 'Updated Successfully', res);
                        }
                        else {
                            sendError({ message: 'Failed to save table' }, res);
                        }
                    }
                });
            }
            else {
                sendError({ message: 'For update table _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.delete('/api/tableReservation/:_id', function (req, res) {
        var Id = req.params._id;
        TableReservation.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
    });

    app.get('/api/tableReservation/userId/:_userId', function (req, res) {
      var userId = req.params._userId;
      TableReservation.find({ UserId: userId }, function (err, result) {
        if (err)
          sendError(err, res);
        else
          sendSuccessResponse(result, '', res);
      });
    });
  //app.post('/api/tableReservation', jsonParser, function (req, res) {
  //  if (req.body != null && req.body != undefined) {
  //    var code = randomstring.generate({
  //      length: 11,
  //      capitalization: 'uppercase'
  //    });
  //    var newTable = new TableReservation({
  //      _id: new mongoose.Types.ObjectId,
  //      FirstName: req.body.FirstName,
  //      ReservationCode: code,
  //      LastName: req.body.LastName,
  //      TableId: req.body.TableId,
  //      UserId: req.body.UserId,
  //      RestaurantId: req.body.RestaurantId,
  //      RestaurantName: req.body.RestaurantName,
  //      TableReservationQuantity: req.body.TableReservationQuantity,
  //      TableReservationDate: req.body.TableReservationDate,
  //      VisitStatus: "reserved",
  //      CreatedDate: new Date(),
  //      ModifiedDate: new Date()
  //    });
  //    newTable.save(function (err, newReservation) {
  //      if (err != null) {
  //        sendError(err, res);
  //      }
  //      else {
  //        if (newReservation != null) {
  //          var updateTable = new Table();
  //          updateTable._id = req.body.TableId;
  //          updateTable.TableStatus = "Reserved";
  //          updateTable.ModifiedDate = new Date()

  //          Table.update({ "_id": updateTable._id }, updateTable, function (err, table) {
  //            if (err != null) {
  //              sendError(err, res);
  //            }
  //            else {
  //              if (table != null) {
  //                sendSuccessResponse(newReservation, 'Added Successfully', res);
  //              }
  //              else {
  //                sendError({ message: 'Failed to update table' }, res);
  //              }
  //            }
  //          });

  //        }
  //        else {
  //          sendError({ message: 'Failed to save Table Category' }, res);
  //        }
  //      }
  //    });
  //  } else {
  //    sendError({ message: 'Request body is null' }, res);
  //  }
  //});

  //app.put('/api/tableReservation', jsonParser, function (req, res) {
  //  if (req.body != null && req.body != undefined) {

  //    if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

  //      var updateTable = new TableReservation();

  //      updateTable._id = req.body._id;
  //      updateTable.FirstName = req.body.FirstName;
  //      updateTable.LastName = req.body.LastName;
  //      updateTable.TableId = req.body.TableId;
  //      updateTable.UserId = req.body.UserId;
  //      updateTable.RestaurantId = req.body.RestaurantId;
  //      updateTable.RestaurantName = req.body.RestaurantName;
  //      updateTable.TableReservationDate = req.body.TableReservationDate;
  //      updateTable.TableReservationQuantity = req.body.TableReservationQuantity;
  //      updateTable.VisitStatus = "reserved",
  //        updateTable.ModifiedDate = new Date()
  //      TableReservation.update({ "_id": req.body._id }, updateTable, function (err, table) {
  //        if (err != null) {
  //          sendError(err, res);
  //        }
  //        else {
  //          if (table != null) {
  //            var updateTable = new Table();
  //            updateTable._id = req.body.TableId;
  //            updateTable.TableReservationDate = req.body.TableReservationDate;
  //            updateTable.TableStatus = "Reserved";
  //            updateTable.ModifiedDate = new Date()

  //            Table.update({ "_id": updateTable._id }, updateTable, function (err, table) {
  //              if (err != null) {
  //                sendError(err, res);
  //              }
  //              else {
  //                if (table != null) {
  //                  sendSuccessResponse(table, 'Updated Successfully', res);
  //                }
  //                else {
  //                  sendError({ message: 'Failed to save table' }, res);
  //                }
  //              }
  //            });
  //          }
  //          else {
  //            sendError({ message: 'Failed to save Table' }, res);
  //          }
  //        }
  //      });
  //    }
  //    else {
  //      sendError({ message: 'For update Table _id is required' }, res);
  //    }

  //  } else {
  //    sendError({ message: 'Request body is null' }, res);
  //  }
  //});
}
