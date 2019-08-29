module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
    var mongoose = require('mongoose');
    const stringify = require('json-stringify-safe');
    var email = require("emailjs");
    var Table = require('../model/Table');
    var TableType = require('../model/TableType');
    var Restaurant = require('../model/Restaurant');
    var TableReservation = require('../model/TableReservation');
    const ObjectId = mongoose.Types.ObjectId;
    app.get('/api/table/type', function (req, res) {
        TableType.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });


    app.get('/api/table', function (req, res) {
        Table.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });
    app.get('/api/table/:_id/status/:_status', function (req, res) {
      var restaurantId =  req.params._id; //"5b473d5bf199aa0970a5d7e7";
      var _status = req.params._status;
      Table.find({ RestaurantId: restaurantId, TableStatus: _status}, function (err, result) {
        if (err)
          sendError(err, res);
        else {
          sendSuccessResponse(result, '', res);
        }
      });
    });
    app.get('/api/restaurant/:_id/Table', function (req, res) {
        var Id = req.params._id;
        Table.find({ RestaurantId: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else {
                sendSuccessResponse(result, '', res);
            }
        });
    });

    app.get('/api/table/:_id', function (req, res) {
        var Id = req.params._id;
        Table.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result[0], '', res);
        });
    });

    app.post('/api/table', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newTable = new Table({
                _id: new mongoose.Types.ObjectId,
                Name: req.body.Name,
                RestaurantId: req.body.RestaurantId,
                RestaurantName: req.body.RestaurantName,
                TableStatus: req.body.TableStatus,
                TableType: req.body.TableType,
                TableReservationDate: null,
                Seats:req.body.Seats,
                CreatedDate: new Date(),
                ModifiedDate: new Date()
            });

            newTable.save(function (err, users) {
                if (err != null) {
                    sendError(err, res);
                }
                else {
                    if (users != null) {
                        sendSuccessResponse(users, 'Added Successfully', res);
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

    app.put('/api/table', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateTable = new Table();

                updateTable._id = req.body._id;
                updateTable.Name = req.body.Name;
                updateTable.RestaurantId = req.body.RestaurantId;
                updateTable.RestaurantName = req.body.RestaurantName;
                updateTable.TableStatus = req.body.TableStatus;
                updateTable.TableType = req.body.TableType;
                updateTable.TableReservationDate = req.body.TableReservationDate? req.body.TableReservationDate:null,
                updateTable.Seats = req.body.Seats;
                updateTable.ModifiedDate = new Date();

                Table.update({ "_id": req.body._id }, updateTable, function (err, table) {
                    if (err != null) {
                        sendError(err, res);
                    }
                    else {
                        if (table != null) {
                            sendSuccessResponse(table, 'Updated Successfully', res);
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

    app.put('/api/table/updatestatus', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateTable = new Table();
                updateTable._id = req.body._id;
                updateTable.TableStatus = req.body.TableStatus;
                updateTable.ModifiedDate = new Date()

                Table.update({ "_id": req.body._id }, updateTable, function (err, table) {
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


    app.delete('/api/table/:_id', function (req, res) {
        var Id = req.params._id;
        Table.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
  });
   
  app.post('/api/sendMail', jsonParser,function (req, res) {
    var userData = req.body;
    var server = email.server.connect({
      user: 'demo@gmail.com',
      password: 'demo@1243',
      host: 'smtp.gmail.com',
      ssl: true
    });

    server.send({
      text: '',
      from: 'Metronic',
      to: 'test@gmail.com',
      subject: 'Notification',
      attachment:
        [
          { data: '<html>Hi ' + userData.FirstName+',<br/><br/> Your Reservation Code is <b>' + userData.ReservationCode+'</b>.</html>', alternative: true }
        ]
    }, function (err, message) {
        if (err) {
          sendError(err, res);
        } else {
          sendSuccessResponse(message, 'Sent Successfully', res);
        }
    });
  });

  /* API TO GET AVAILABLE SEATS IN RESTAURANT :START */
  app.get('/api/table/restaurantId/:_restaurantId/date/:_date', function (req, res) {
    var _restaurantId = req.params._restaurantId;
    var date = req.params._date;
    //date.toISOString();
    //var converteddate = Date.parse(date);
    var newdate = new Date(date); 
    var getMinutes = newdate.getMinutes() + 30;
    newdate.setMinutes(getMinutes);
    //$or: [{ TableReservationDate: { $gte: newdate} }, { TableReservationDate: { $lt: date } },{ TableReservationDate: null }],

    Restaurant.find({ _id: _restaurantId }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        var totalSeats = result[0].TotalSeats;
        var availableSeats = 0;
        Table.aggregate(
          [{ "$match": { RestaurantId: ObjectId(_restaurantId) } }
          ], function (err, result) {
            if (err)
              sendError(err, res);
            else {
              var TableList = [];
              result.forEach(function (element) {
                var TableReservationDate = element.TableReservationDate;
                if ((TableReservationDate >= newdate || TableReservationDate < date) || TableReservationDate == null || !TableReservationDate) {
                  TableList.push(element);
                }
                //else {
                //  console.log("condition false");
                //}  
                var seats = element.Seats?parseInt(element.Seats):0;
                availableSeats += seats;
              });
              var data = {};
              data.TotalAvailableSeats = availableSeats;
              data.TableList = TableList;
              sendSuccessResponse(data, '', res);
            }
          });
      }

    });
    
  });
  /* API TO GET AVAILABLE SEATS IN RESTAURANT :END */
}
