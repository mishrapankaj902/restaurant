

module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
  var geodist = require('geodist');
  var mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
  var Restaurant = require('../model/Restaurant');
  var Menu = require('../model/Menu');
  var Image = require('../model/Image');
  var MenuCategory = require('../model/MenuCategory'); 
  var RestaurantCategory = require('../model/RestaurantCategory');
  var RestaurantReview = require('../model/RestaurantReview');
  var Offer = require('../model/Offer');

  app.get('/api/restaurant', function (req, res) {
    var resultData = [];
    var prd = [];
    Restaurant.find({}, function (err, restaurant) {
      if (err)
        sendError(err, res);
      else {
        //var restaurantTimings;
        //RestaurantTimings.find({}, function (errRes, restaurantTiming) {
        //  if (!errRes) {
        //    restaurantTimings = restaurantTiming;
            RestaurantCategory.find({}, function (errRes, restaurantCategory) {
              if (!errRes) {
                restaurant.forEach(function (element) {
                  //var RestaurantTimingsArr = restaurantTimings.filter(p => p.RestaurantId == element._id.toString())[0];
                  resultData.push({
                    Restaurant: element,
                    RestaurantCategory: restaurantCategory.filter(p => p._id == element.RestaurantCategoryId.toString())[0],
                   // OpeningHours: RestaurantTimingsArr ? RestaurantTimingsArr.OpeningHours : [],
                  })
                })
                sendSuccessResponse(resultData, '', res);
              } else {
                sendError(errRes, res);
              }

            });
        //  } else {
        //    sendError(errRes, res);
        //  }
        //})

        
      }

    });
  });

  app.get('/api/restaurant/user/:_id', function (req, res) {
    var resultData = [];
    var prd = [];
    var Id = req.params._id;
    Restaurant.find({ UserId: Id }, function (err, restaurant) {
      if (err)
        sendError(err, res);
      else {
        RestaurantCategory.find({}, function (errRes, restaurantCategory) {
          if (!errRes) {
            restaurant.forEach(function (element) {
              resultData.push({
                Restaurant: element,
                RestaurantCategory: restaurantCategory.filter(p => p._id == element.RestaurantCategoryId.toString())[0]
              })
            })
            sendSuccessResponse(resultData, '', res);
          } else {
            sendError(errRes, res);
          }

        });
      }

    });
  });

  app.get('/api/get/restaurant', function (req, res) {
    Restaurant.find({}, function (err, result) {
      if (err)
        sendError(err, res);
      else
        sendSuccessResponse(result, '', res);
    });
  });

  app.get('/api/restaurant/:_id', function (req, res) {
    var Id = req.params._id;
    Restaurant.find({ _id: Id }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }

    });
  });

  app.post('/api/restaurant', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var newRestaurant = new Restaurant({
        _id: new mongoose.Types.ObjectId,
        Name: req.body.Name,
        Email: req.body.Email,
        RestaurantCategoryId: req.body.RestaurantCategoryId,
        RestaurantCategoryName: req.body.RestaurantCategoryName,
        Address: req.body.Address,
        StripeId: req.body.StripeId,
        UserId: req.body.UserId,
        Images: [],
        Description: req.body.Description,
        PhoneNumber: req.body.PhoneNumber,
        CreatedDate: new Date(),
        ModifiedDate: new Date(),
        City: req.body.City,
        DishType: req.body.DishType,
        DisNationality: req.body.DisNationality,
        Label: req.body.Label,
        Lat: req.body.Lat,
        Long: req.body.Long,
        Picture: req.body.Picture,
        Rating: req.body.Rating,
        Reviews: req.body.Reviews,
        State: req.body.State,
        Tags: req.body.Tags,
        ThumbNail: req.body.ThumbNail,
        Title: req.body.Title,
        Zip: req.body.Zip,
        Price: req.body.Price,
        OpeningTime: req.body.OpeningTime,
        ClosingTime: req.body.ClosingTime,
        TotalSeats: req.body.TotalSeats,
        DietaryType: req.body.DietaryType
      });

      newRestaurant.save(function (err, users) {
        if (err != null) {
          sendError(err, res);
        }
        else {
          if (users != null) {
            sendSuccessResponse(users, 'Added Successfully', res);
          }
          else {
            sendError({ message: 'Failed to save restaurant' }, res);
          }
        }
      });
    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });

  app.put('/api/restaurant', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {

      if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

        var updateRestaurant = new Restaurant();

        updateRestaurant.Name = req.body.Name,
          Email = req.body.Email,
          updateRestaurant.RestaurantCategoryId = req.body.RestaurantCategoryId,
          updateRestaurant.RestaurantCategoryName = req.body.RestaurantCategoryName,
          updateRestaurant.Address = req.body.Address,
          updateRestaurant.StripeId = req.body.StripeId,
          updateRestaurant.UserId = req.body.UserId,
          updateRestaurant.Images = [],
          updateRestaurant.Description = req.body.Description,
          updateRestaurant.PhoneNumber = req.body.PhoneNumber,
         // updateRestaurant.CreatedDate = new Date(),
          updateRestaurant.ModifiedDate = new Date(),
          updateRestaurant.City = req.body.City,
          updateRestaurant.DishType = req.body.DishType,
          updateRestaurant.DisNationality = req.body.DisNationality,
          updateRestaurant.Label = req.body.Label,
          updateRestaurant.Lat = req.body.Lat,
          updateRestaurant.Long = req.body.Long,
          updateRestaurant.Picture = req.body.Picture,
          updateRestaurant.Rating = req.body.Rating,
          updateRestaurant.Reviews = req.body.Reviews,
          updateRestaurant.State = req.body.State,
          updateRestaurant.Tags = req.body.Tags,
          updateRestaurant.ThumbNail = req.body.ThumbNail,
          updateRestaurant.Title = req.body.Title,
          updateRestaurant.Zip = req.body.Zip,
          updateRestaurant.Price = req.body.Price,
          updateRestaurant.OpeningTime = req.body.OpeningTime,
          updateRestaurant.ClosingTime = req.body.ClosingTime,
          updateRestaurant.TotalSeats = req.body.TotalSeats,
          updateRestaurant.DietaryType = req.body.DietaryType,

        Restaurant.update({ "_id": req.body._id }, updateRestaurant, function (err, restaurants) {
          if (err != null) {
            sendError(err, res);
          }
          else {
            if (restaurants != null) {
              sendSuccessResponse(restaurants, 'Updated Successfully', res);
            }
            else {
              sendError({ message: 'Failed to save restaurant' }, res);
            }
          }
        });
      }
      else {
        sendError({ message: 'For update restaurants _id is required' }, res);
      }

    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });

  app.delete('/api/restaurant/:_id', function (req, res) {
    var Id = req.params._id;
    Restaurant.findOneAndDelete({ _id: Id }, function (err, result) {
      if (err)
        sendError(err, res);
      else
        sendSuccessResponse(result, 'Deleted Successfully', res);
    });
  });

  app.get('/api/restaurant/categoryId/:_categoryId/user/:_userID', function (req, res) {
    var categoryId = req.params._categoryId;
    var userId = req.params._userID;
    Restaurant.find({ RestaurantCategoryId: categoryId, UserId: userId }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }

    });
  });

  app.get('/api/restaurant/categoryId/:_categoryId', function (req, res) {
    var categoryId = req.params._categoryId;
    var userId = req.params._userID;
    Restaurant.find({ RestaurantCategoryId: categoryId}, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        sendSuccessResponse(result, '', res);
      }

    });
  });

  app.get('/api/restaurant/pageNo/:_pageNo/pageSize/:_pageSize', function (req, res) {
    var resultData = [];
    var prd = [];
    var pageNo = parseInt(req.params._pageNo);
    var pageSize = parseInt(req.params._pageSize);
    Restaurant.find({}, function (err, restaurant) {
      if (err)
        sendError(err, res);
      else {
        RestaurantCategory.find({}, function (errRes, restaurantCategory) {
          if (!errRes) {
            restaurant.forEach(function (element) {
              resultData.push({
                Restaurant: element,
                RestaurantCategory: restaurantCategory.filter(p => p._id == element.RestaurantCategoryId.toString())[0]
              })
            })
            sendSuccessResponse(resultData, '', res);
          } else {
            sendError(errRes, res);
          }

        });
      }

    }).skip(pageSize * (pageNo - 1)).limit(pageSize);

  });

  app.get("/api/search/:_searchItem", function (req, res) {
   
    var _searchItem = req.params._searchItem;
    Restaurant.aggregate(
      [
        { $match: { $or: [{ Name: { '$regex': _searchItem, '$options': 'i' } }, { Address: { '$regex': _searchItem, '$options': 'i' } }] } },

      ], function (err, result) {
        var resultantData = { "Restaurant": [], "Menu": [], "RestaurantCategory": [] };
        if (err) {
          sendError(err, res);
        }
        else {
          resultantData.Restaurant = result;
          RestaurantCategory.find({}, function (errRes, restaurantCategory) {
            if (!errRes) {
              result.forEach(function (element) {
                element.RestaurantCategoryName = restaurantCategory.filter(p => p._id == element.RestaurantCategoryId.toString())[0].Name;

                resultantData.Restaurant = result;
              });
                }
                else {
              sendError(errRes, res);
            }

          });
          Menu.aggregate(
            [
              { $match: { Name: { '$regex': _searchItem, '$options': 'i' } } },

            ], function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var menuListResult = [];
                Restaurant.find({}, function (error, restaurant) {
                  response.forEach(function (element) {
                    menuListResult.push({
                      Name: element.Name,
                      Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())
                    });
                  });
                  resultantData.Menu = menuListResult;
                  //sendSuccessResponse(resultantData, '', res);
                });
                RestaurantCategory.aggregate(
                  [
                    { $match: { Name: { '$regex': _searchItem, '$options': 'i' } } },

                  ], function (error, response) {
                    if (error) {
                      sendError(error, res);
                    }
                    else {
                      var categoryResult = [];
                      Restaurant.find({}, function (error, restaurant) {
                        response.forEach(function (element) {
                          categoryResult.push({
                            Name: element.Name,
                            Restaurant: restaurant.filter(p => p.RestaurantCategoryId == element._id.toString())
                          });
                        });
                        resultantData.RestaurantCategory = categoryResult;
                        sendSuccessResponse(resultantData, '', res);
                      });
                    }
                  }
                );
              }
            }
          );
        }

      }
    );
  });

  /* User Filter API: START */
  var resultantData = {};
  var checkData = new Array();

  function sendResponse(filterLength, res) {
    if (filterLength == checkData.length) {
      sendSuccessResponse(resultantData, '', res);
    } else {
      setTimeout(function () {
        sendResponse(filterLength, res);
      }, 500);

    }
  }
  app.get("/api/search/:_searchItem/filter/:_filterData/sort/:_sortData/dietarytype/:_dietarytype/lat/:_lat/long/:_long", function (req, res) {
    var _searchItem = req.params._searchItem;
    var filterData = req.params._filterData;
    var sortData = req.params._sortData;
    var dietarytype = req.params._dietarytype;
    var userLat = req.params._lat;
    var userLong = req.params._long;
    var dietarytypeArr = [];
    var menuCategoryDietryQry = {}
    var conditionalQuery = {
      $match: {
        Name: { '$regex': _searchItem, '$options': 'i' }
      }
    }
    if (dietarytype != 'none') {
      dietarytypeArr = dietarytype.split(',');
      conditionalQuery = {
        $match: {
          Name: { '$regex': _searchItem, '$options': 'i' }, DietaryType: { $in: dietarytypeArr }
        }
      }
      menuCategoryDietryQry = { DietaryType: { $in: dietarytypeArr } }
    }
      //{ $match: { $or: [{ Name: { '$regex': _searchItem, '$options': 'i' } }, { Address: { '$regex': _searchItem, '$options': 'i' } }] } },
    if (filterData == "all") {
     
      Restaurant.aggregate(
        [
          { $match: { Name: { '$regex': _searchItem, '$options': 'i' } } }
        ], function (err, result) {
          var resultantData = { "Restaurant": [], "Menu": [], "MenuCategory": [] };
          if (err) {
            sendError(err, res);
          }
          else {
            result.forEach(function (e, index) {
              var distanceLimit;
              if (sortData.indexOf("distance") > -1) {
                distanceLimit = sortData.split(",")[1].trim();
                var lati = result[index].Lat;
                var longi = result[index].Long;
                var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                result[index].Distance = dist ? dist : 0;

              }
              if (index == (result.length - 1)) {
                var finalResult = distanceLimit ? result.filter((x) => { return x.Distance <= distanceLimit }): result;
                finalResult.sort(function (a, b) {
                  return ((b.Distance - a.Distance)) // descending order
                });
                finalResult.forEach(function (ele, i) {
                  RestaurantReview.aggregate(
                    [
                      { "$match": { "RestaurantId": ObjectId(ele._id) } },
                      { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                    ], function (err, resReviewResult) {
                      finalResult[i].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                      if (i == (finalResult.length - 1)) {
                        if (sortData.indexOf("toprated") > -1) {
                          finalResult.sort(function (a, b) {
                            return ((b.Rating - a.Rating)) // descending order
                          });
                        }
                        resultantData.Restaurant = finalResult;
                      }
                    });
                });
              }
             
            });
            
            Menu.aggregate(
              [
                conditionalQuery
              ], function (error, response) {
                if (error) {
                  sendError(error, res);
                }
                else {
                  var menuListResult = [];
                  if (response.length > 0) {
                    Restaurant.find({}, function (error, restaurant) {
                      restaurant.forEach(function (e, index) {
                        if (sortData.indexOf("distance") > -1) {
                          var lati = restaurant[index].Lat;
                          var longi = restaurant[index].Long;
                          var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                          restaurant[index].Distance = dist;
                        }
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            // restaurant[index].RestaurantReview = resReviewResult;
                            restaurant[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (restaurant.length - 1)) {

                              response.forEach(function (element) {
                                menuListResult.push({
                                  Name: element.Name,
                                  Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())
                                });
                              });
                              resultantData.Menu = menuListResult;
                            }
                          });
                      });

                    });
                  }


                  MenuCategory.aggregate(
                    [

                      { $match: { Name: { '$regex': _searchItem, '$options': 'i' } } }

                    ], function (error, response) {
                      if (error) {
                        sendError(error, res);
                      }
                      else {
                        var menuCategoryResult = [];
                        var restaurantResult = {};
                        Restaurant.find({}, function (err, result) {
                          if (err)
                            sendError(err, res);
                          else {
                            result.forEach(function (e, index) {
                              if (sortData.indexOf("distance") > -1) {
                                var lati = result[index].Lat;
                                var longi = result[index].Long;
                                var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                                result[index].Distance = dist;
                              }
                              RestaurantReview.aggregate(
                                [
                                  { "$match": { "RestaurantId": ObjectId(e._id) } },
                                  { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                                ], function (err, resReviewResult) {
                                  
                                  result[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                                  if (index == (result.length - 1)) {
                                   
                                    restaurantResult = result;
                                    Menu.find(menuCategoryDietryQry, function (error, menu) {
                                      if (error) {
                                        sendError(error, res);
                                      } else {
                                        response.forEach(function (element) {
                                          var menus = menu.filter(p => p.MenuCategoryId == element._id.toString());
                                          for (var i = 0; i < menus.length; i++) {
                                            var restaurantdetail = restaurantResult.filter(p => p._id == menus[i].RestaurantId.toString());
                                            menus[i].RestaurantDetail = restaurantdetail;
                                            if (i == (menus.length - 1)) {
                                              menuCategoryResult.push({
                                                MenuCategory: element.Name,
                                                Menu: menus
                                              });
                                            }
                                          }

                                        });
                                        resultantData.MenuCategory = menuCategoryResult;
                                        sendSuccessResponse(resultantData, '', res);
                                      }
                                    });
                                  }
                                });
                            });
                            
                          }
                        });


                      }
                    }
                  );
                }
              }
            );

          }

        }
      );
    }
    else {
      var filterDataArr = filterData.split(",");
      var filterDataArrLen = filterDataArr.length;
      filter = filterDataArr;
      checkData = [];
      resultantData = {};
      filterDataArr.forEach(function (element, i) {
        if (element == 'menu') {

          Menu.aggregate(
            [
              conditionalQuery
            ], function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var menuListResult = [];
                if (response.length > 0) {
                  Restaurant.find({}, function (error, restaurant) {
                    if (error) {
                      sendError(error, res);
                    } else {
                      restaurant.forEach(function (e, index) {
                        if (sortData.indexOf("distance") > -1) {
                          var lati = restaurant[index].Lat;
                          var longi = restaurant[index].Long;
                          var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                          restaurant[index].Distance = dist ? dist : 0;
                        }
                       
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            //restaurant[index].RestaurantReview = resReviewResult;
                            restaurant[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (restaurant.length - 1)) {
                              response.forEach(function (element) {
                                menuListResult.push({
                                  Name: element.Name,
                                  Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())
                                });
                              });
                              resultantData.Menu = menuListResult;
                              checkData.push("menu");
                              if (i == (filterDataArrLen - 1)) {
                                sendResponse(filterDataArrLen, res);
                              }
                            }
                          });
                      });

                    }
                  });
                } else if (response.length == 0) {
                  checkData.push("menu");
                  resultantData.Menu = menuListResult;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }
                
              }
            }
          );
        }
        if (element == 'restaurant') {
          Restaurant.aggregate(
            [
              { $match: { Name: { '$regex': _searchItem, '$options': 'i' } } },

            ], function (err, result) {
              if (err) {
                sendError(err, res);
              }
              else {
                if (result.length > 0) {
                  result.forEach(function (e, index) {
                    if (sortData.indexOf("distance") > -1) {
                      var distanceLimit = sortData.split(",")[1].trim();
                     
                      var lati = result[index].Lat;
                      var longi = result[index].Long;
                      var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                      result[index].Distance = dist ? dist : 0;
                    }

                    if (index == (result.length - 1)) {
                      var finalResult = distanceLimit ? result.filter((x) => { return x.Distance <= distanceLimit }) : result;
                      //finalResult = result.filter((x) => { return x.Distance <= 5398.380323891404; });
                      finalResult.sort(function (a, b) {
                        return ((b.Distance - a.Distance)) // descending order
                      });
                      finalResult.forEach(function (ele, ind) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(ele._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                           // finalResult[ind].RestaurantReview = resReviewResult;
                            finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (ind == (finalResult.length - 1)) {
                               if (sortData.indexOf("toprated") > -1) {
                          finalResult.sort(function (a, b) {
                            return ((b.Rating - a.Rating)) // descending order
                          });
                        }
                              resultantData.Restaurant = finalResult;
                              checkData.push("restaurant");
                              if (i == (filterDataArrLen - 1)) {
                                sendResponse(filterDataArrLen, res);
                              }
                            }
                          });
                      });
                    }

                   
                  });
                } else if (result.length == 0) {
                  checkData.push("restaurant");
                  resultantData.Restaurant = result;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }
              }
            });
        }
        if (element == 'menucategory') {
          MenuCategory.aggregate(
            [

              { $match: { Name: { '$regex': _searchItem, '$options': 'i' } } }

            ], function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var menuCategoryResult = [];
                var restaurantResult = {};
                if (response.length > 0) {
                  Restaurant.find({}, function (err, result) {
                    if (err)
                      sendError(err, res);
                    else {
                      result.forEach(function (e, index) {
                        if (sortData.indexOf("distance") > -1) {
                          var lati = result[index].Lat;
                          var longi = result[index].Long;
                          var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                          result[index].Distance = dist ? dist : 0;
                        }
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                           // result[index].RestaurantReview = resReviewResult;
                            result[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (result.length - 1)) {
                              restaurantResult = result;
                              Menu.find(menuCategoryDietryQry, function (error, menu) {
                                if (error) {
                                  sendError(error, res);
                                } else {
                                  response.forEach(function (element) {
                                    var menus = menu.filter(p => p.MenuCategoryId == element._id.toString());
                                    for (var i = 0; i < menus.length; i++) {
                                      var restaurantdetail = restaurantResult.filter(p => p._id == menus[i].RestaurantId.toString());
                                      menus[i].RestaurantDetail = restaurantdetail;
                                      if (i == (menus.length - 1)) {
                                        menuCategoryResult.push({
                                          MenuCategory: element.Name,
                                          Menu: menus
                                        });
                                      }
                                    }

                                  });
                                  resultantData.MenuCategory = menuCategoryResult;
                                  checkData.push("menucategory");

                                  if (i == (filterDataArrLen - 1)) {
                                    sendResponse(filterDataArrLen, res);
                                  }
                                }
                              });
                            }
                          });
                      });
                    }
                  });
                }
                else if (response.length == 0) {
                  checkData.push("menucategory");
                  resultantData.MenuCategory = menuCategoryResult;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }
              }
            }
          );
        }
        if (element == 'restaurantcategory') {
          RestaurantCategory.aggregate(
            [
              { $match: { Name: { '$regex': _searchItem, '$options': 'i' } } },

            ], function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var categoryResult = [];
                Restaurant.find({}, function (error, restaurant) {
                  if (error) {
                    sendError(error, res);
                  } else {
                    response.forEach(function (element) {
                      
                      categoryResult.push({
                        Name: element.Name,
                        Restaurant: restaurant.filter(p => p.RestaurantCategoryId == element._id.toString())
                      });
                    });
                    resultantData.RestaurantCategory = categoryResult;
                    checkData.push("restaurantcategory");
                    if (i == (filterDataArrLen - 1)) {
                      sendResponse(filterDataArrLen, res);
                    }
                  }
                });

              }
            }
          );
        }

      });

    }

  });

  /* User Filter API: END */
  
  /* API For Most Relevance with search result : Start */
  app.get("/api/search/:_searchItem/filter/:_filterData/sort/mostrelevance/dietarytype/:_dietarytype", function (req, res) {
    var _searchItem = req.params._searchItem;
    var filterData = req.params._filterData;
    var sortData = req.params._sortData;
    var dietarytype = req.params._dietarytype;
    var dietarytypeArr = [];
    var menuCategoryDietryQry = {};
    menuCategoryDietryQry.$text = { $search: _searchItem };
    if (dietarytype != 'none') {
      dietarytypeArr = dietarytype.split(',');
      menuCategoryDietryQry.DietaryType = { $in: dietarytypeArr };
     // menuCategoryDietryQry = { $in: dietarytypeArr }; DietaryType: { $in: dietarytypeArr };
    }
    if (filterData == "all") {

      Restaurant.find(
        { $text: { $search: _searchItem } }, { score: { $meta: "textScore" } },
        function (err, result) {
          var resultantData = { "Restaurant": [], "Menu": [], "MenuCategory": [] };
          if (err) {
            sendError(err, res);
          }
          else {
            result.forEach(function (e, index) {
              if (index == (result.length - 1)) {
                var finalResult =  result;
                finalResult.forEach(function (ele, i) {
                  RestaurantReview.aggregate(
                    [
                      { "$match": { "RestaurantId": ObjectId(ele._id) } },
                      { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                    ], function (err, resReviewResult) {
                      finalResult[i].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                      if (i == (finalResult.length - 1)) {
                        resultantData.Restaurant = finalResult;
                      }
                    });
                });
              }

            });

            Menu.find(
              menuCategoryDietryQry, { score: { $meta: "textScore" } },function (error, response) {
                if (error) {
                  sendError(error, res);
                }
                else {
                  var menuListResult = [];
                  if (response.length > 0) {
                    Restaurant.find({}, function (error, restaurant) {
                      restaurant.forEach(function (e, index) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            restaurant[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (restaurant.length - 1)) {

                              response.forEach(function (element) {
                                menuListResult.push({
                                  Name: element.Name,
                                  Menu: element,
                                  Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())
                                });
                              });
                              resultantData.Menu = menuListResult;
                            }
                          });
                      });

                    });
                  }


                  MenuCategory.find(menuCategoryDietryQry, { score: { $meta: "textScore" } }
                   , function (error, response) {
                      if (error) {
                        sendError(error, res);
                      }
                      else {
                        var menuCategoryResult = [];
                        var restaurantResult = {};
                        Restaurant.find({}, function (err, result) {
                          if (err)
                            sendError(err, res);
                          else {

                            result.forEach(function (e, index) {
                              RestaurantReview.aggregate(
                                [
                                  { "$match": { "RestaurantId": ObjectId(e._id) } },
                                  { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                                ], function (err, resReviewResult) {
                                  result[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                                  if (index == (result.length - 1)) {
                                    restaurantResult = result;
                                    Menu.find(menuCategoryDietryQry, function (error, menu) {
                                      if (error) {
                                        sendError(error, res);
                                      } else {
                                        response.forEach(function (element) {
                                          var menus = menu.filter(p => p.MenuCategoryId == element._id.toString());
                                          for (var i = 0; i < menus.length; i++) {
                                            var restaurantdetail = restaurantResult.filter(p => p._id == menus[i].RestaurantId.toString());
                                            menus[i].RestaurantDetail = restaurantdetail;
                                            if (i == (menus.length - 1)) {
                                              menuCategoryResult.push({
                                                MenuCategoryName: element.Name,
                                                MenuCategory: element,
                                                Menu: menus
                                              });
                                            }
                                          }

                                        });
                                        resultantData.MenuCategory = menuCategoryResult;
                                        sendSuccessResponse(resultantData, '', res);
                                      }
                                    });
                                  }
                                });
                            });

                          }
                        });


                      }
                    }
                  ).sort({ score: { $meta: "textScore" } });
                }
              }
            ).sort({ score: { $meta: "textScore" } });
          }
        }
      ).sort({ score: { $meta: "textScore" } });
    }
    else {
      var filterDataArr = filterData.split(",");
      var filterDataArrLen = filterDataArr.length;
      filter = filterDataArr;
      checkData = [];
      resultantData = {};
      filterDataArr.forEach(function (element, i) {
        if (element == 'menu') {

          Menu.find(
            menuCategoryDietryQry, { score: { $meta: "textScore" } }, function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var menuListResult = [];
                if (response.length > 0) {
                  Restaurant.find({}, function (error, restaurant) {
                    if (error) {
                      sendError(error, res);
                    } else {
                      restaurant.forEach(function (e, index) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            restaurant[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (restaurant.length - 1)) {
                              response.forEach(function (element) {
                                menuListResult.push({
                                  Name: element.Name,
                                  Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())
                                });
                              });
                              resultantData.Menu = menuListResult;
                              checkData.push("menu");
                              if (i == (filterDataArrLen - 1)) {
                                sendResponse(filterDataArrLen, res);
                              }
                            }
                          });
                      });
                    }
                  });
                } else if (response.length == 0) {
                  checkData.push("menu");
                  resultantData.Menu = menuListResult;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }

              }
            }
          ).sort({ score: { $meta: "textScore" } });
        }
        if (element == 'restaurant') {
          Restaurant.find(
            { $text: { $search: _searchItem } }, { score: { $meta: "textScore" } }, function (err, result) {
              if (err) {
                sendError(err, res);
              }
              else {
                if (result.length > 0) {
                  result.forEach(function (e, index) {

                    if (index == (result.length - 1)) {
                      var finalResult = result;
                      finalResult.forEach(function (ele, ind) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(ele._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (ind == (finalResult.length - 1)) {
                              resultantData.Restaurant = finalResult;
                              checkData.push("restaurant");
                              if (i == (filterDataArrLen - 1)) {
                                sendResponse(filterDataArrLen, res);
                              }
                            }
                          });
                      });
                    }
                  });
                } else if (result.length == 0) {
                  checkData.push("restaurant");
                  resultantData.Restaurant = result;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }
              }
            }).sort({ score: { $meta: "textScore" } });
        }
        if (element == 'menucategory') {
          MenuCategory.find(
            menuCategoryDietryQry, { score: { $meta: "textScore" } }, function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var menuCategoryResult = [];
                var restaurantResult = {};
                if (response.length > 0) {
                  Restaurant.find({}, function (err, result) {
                    if (err)
                      sendError(err, res);
                    else {
                      result.forEach(function (e, index) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            result[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (result.length - 1)) {
                              restaurantResult = result;
                              Menu.find(menuCategoryDietryQry, function (error, menu) {
                                if (error) {
                                  sendError(error, res);
                                } else {
                                  response.forEach(function (element) {
                                    var menus = menu.filter(p => p.MenuCategoryId == element._id.toString());
                                    for (var i = 0; i < menus.length; i++) {
                                      var restaurantdetail = restaurantResult.filter(p => p._id == menus[i].RestaurantId.toString());
                                      menus[i].RestaurantDetail = restaurantdetail;
                                      if (i == (menus.length - 1)) {
                                        menuCategoryResult.push({
                                          MenuCategory: element.Name,
                                          Menu: menus
                                        });
                                      }
                                    }
                                  });
                                  resultantData.MenuCategory = menuCategoryResult;
                                  checkData.push("menucategory");

                                  if (i == (filterDataArrLen - 1)) {
                                    sendResponse(filterDataArrLen, res);
                                  }
                                }
                              });
                            }
                          });
                      });
                    }
                  });
                }
                else if (response.length == 0) {
                  checkData.push("menucategory");
                  resultantData.MenuCategory = menuCategoryResult;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }
              }
            }
          ).sort({ score: { $meta: "textScore" } });
        }
      });

    }

  });
  /* API For Most Relevance with search result : End */
  app.get("/api/search/:_searchItem/filter/:_filterData/sort/mostrelevance/dietarytype/:_dietarytype", function (req, res) {
    var _searchItem = req.params._searchItem;
    var filterData = req.params._filterData;
    var sortData = req.params._sortData;
    var dietarytype = req.params._dietarytype;
    var dietarytypeArr = [];
    var menuCategoryDietryQry = {};
    menuCategoryDietryQry.$text = { $search: _searchItem };
    if (dietarytype != 'none') {
      dietarytypeArr = dietarytype.split(',');
      menuCategoryDietryQry.DietaryType = { $in: dietarytypeArr };
      // menuCategoryDietryQry = { $in: dietarytypeArr }; DietaryType: { $in: dietarytypeArr };
    }
    if (filterData == "all") {

      Restaurant.find(
        { $text: { $search: _searchItem } }, { score: { $meta: "textScore" } },
        function (err, result) {
          var resultantData = { "Restaurant": [], "Menu": [], "MenuCategory": [] };
          if (err) {
            sendError(err, res);
          }
          else {
            result.forEach(function (e, index) {
              if (index == (result.length - 1)) {
                var finalResult = result;
                finalResult.forEach(function (ele, i) {
                  RestaurantReview.aggregate(
                    [
                      { "$match": { "RestaurantId": ObjectId(ele._id) } },
                      { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                    ], function (err, resReviewResult) {
                      finalResult[i].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                      if (i == (finalResult.length - 1)) {
                        resultantData.Restaurant = finalResult;
                      }
                    });
                });
              }

            });

            Menu.find(
              menuCategoryDietryQry, { score: { $meta: "textScore" } }, function (error, response) {
                if (error) {
                  sendError(error, res);
                }
                else {
                  var menuListResult = [];
                  if (response.length > 0) {
                    Restaurant.find({}, function (error, restaurant) {
                      restaurant.forEach(function (e, index) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            restaurant[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (restaurant.length - 1)) {

                              response.forEach(function (element) {
                                menuListResult.push({
                                  Name: element.Name,
                                  Menu: element,
                                  Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())
                                });
                              });
                              resultantData.Menu = menuListResult;
                            }
                          });
                      });

                    });
                  }


                  MenuCategory.find(menuCategoryDietryQry, { score: { $meta: "textScore" } }
                    , function (error, response) {
                      if (error) {
                        sendError(error, res);
                      }
                      else {
                        var menuCategoryResult = [];
                        var restaurantResult = {};
                        Restaurant.find({}, function (err, result) {
                          if (err)
                            sendError(err, res);
                          else {

                            result.forEach(function (e, index) {
                              RestaurantReview.aggregate(
                                [
                                  { "$match": { "RestaurantId": ObjectId(e._id) } },
                                  { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                                ], function (err, resReviewResult) {
                                  result[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                                  if (index == (result.length - 1)) {
                                    restaurantResult = result;
                                    Menu.find(menuCategoryDietryQry, function (error, menu) {
                                      if (error) {
                                        sendError(error, res);
                                      } else {
                                        response.forEach(function (element) {
                                          var menus = menu.filter(p => p.MenuCategoryId == element._id.toString());
                                          for (var i = 0; i < menus.length; i++) {
                                            var restaurantdetail = restaurantResult.filter(p => p._id == menus[i].RestaurantId.toString());
                                            menus[i].RestaurantDetail = restaurantdetail;
                                            if (i == (menus.length - 1)) {
                                              menuCategoryResult.push({
                                                MenuCategoryName: element.Name,
                                                MenuCategory: element,
                                                Menu: menus
                                              });
                                            }
                                          }

                                        });
                                        resultantData.MenuCategory = menuCategoryResult;
                                        sendSuccessResponse(resultantData, '', res);
                                      }
                                    });
                                  }
                                });
                            });

                          }
                        });


                      }
                    }
                  ).sort({ score: { $meta: "textScore" } });
                }
              }
            ).sort({ score: { $meta: "textScore" } });
          }
        }
      ).sort({ score: { $meta: "textScore" } });
    }
    else {
      var filterDataArr = filterData.split(",");
      var filterDataArrLen = filterDataArr.length;
      filter = filterDataArr;
      checkData = [];
      resultantData = {};
      filterDataArr.forEach(function (element, i) {
        if (element == 'menu') {

          Menu.find(
            menuCategoryDietryQry, { score: { $meta: "textScore" } }, function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var menuListResult = [];
                if (response.length > 0) {
                  Restaurant.find({}, function (error, restaurant) {
                    if (error) {
                      sendError(error, res);
                    } else {
                      restaurant.forEach(function (e, index) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            restaurant[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (restaurant.length - 1)) {
                              response.forEach(function (element) {
                                menuListResult.push({
                                  Name: element.Name,
                                  Restaurant: restaurant.filter(p => p._id == element.RestaurantId.toString())
                                });
                              });
                              resultantData.Menu = menuListResult;
                              checkData.push("menu");
                              if (i == (filterDataArrLen - 1)) {
                                sendResponse(filterDataArrLen, res);
                              }
                            }
                          });
                      });
                    }
                  });
                } else if (response.length == 0) {
                  checkData.push("menu");
                  resultantData.Menu = menuListResult;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }

              }
            }
          ).sort({ score: { $meta: "textScore" } });
        }
        if (element == 'restaurant') {
          Restaurant.find(
            { $text: { $search: _searchItem } }, { score: { $meta: "textScore" } }, function (err, result) {
              if (err) {
                sendError(err, res);
              }
              else {
                if (result.length > 0) {
                  result.forEach(function (e, index) {

                    if (index == (result.length - 1)) {
                      var finalResult = result;
                      finalResult.forEach(function (ele, ind) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(ele._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (ind == (finalResult.length - 1)) {
                              resultantData.Restaurant = finalResult;
                              checkData.push("restaurant");
                              if (i == (filterDataArrLen - 1)) {
                                sendResponse(filterDataArrLen, res);
                              }
                            }
                          });
                      });
                    }
                  });
                } else if (result.length == 0) {
                  checkData.push("restaurant");
                  resultantData.Restaurant = result;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }
              }
            }).sort({ score: { $meta: "textScore" } });
        }
        if (element == 'menucategory') {
          MenuCategory.find(
            menuCategoryDietryQry, { score: { $meta: "textScore" } }, function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var menuCategoryResult = [];
                var restaurantResult = {};
                if (response.length > 0) {
                  Restaurant.find({}, function (err, result) {
                    if (err)
                      sendError(err, res);
                    else {
                      result.forEach(function (e, index) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(e._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            result[index].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            if (index == (result.length - 1)) {
                              restaurantResult = result;
                              Menu.find(menuCategoryDietryQry, function (error, menu) {
                                if (error) {
                                  sendError(error, res);
                                } else {
                                  response.forEach(function (element) {
                                    var menus = menu.filter(p => p.MenuCategoryId == element._id.toString());
                                    for (var i = 0; i < menus.length; i++) {
                                      var restaurantdetail = restaurantResult.filter(p => p._id == menus[i].RestaurantId.toString());
                                      menus[i].RestaurantDetail = restaurantdetail;
                                      if (i == (menus.length - 1)) {
                                        menuCategoryResult.push({
                                          MenuCategory: element.Name,
                                          Menu: menus
                                        });
                                      }
                                    }
                                  });
                                  resultantData.MenuCategory = menuCategoryResult;
                                  checkData.push("menucategory");

                                  if (i == (filterDataArrLen - 1)) {
                                    sendResponse(filterDataArrLen, res);
                                  }
                                }
                              });
                            }
                          });
                      });
                    }
                  });
                }
                else if (response.length == 0) {
                  checkData.push("menucategory");
                  resultantData.MenuCategory = menuCategoryResult;
                  if (i == (filterDataArrLen - 1)) {
                    sendResponse(filterDataArrLen, res);
                  }
                }
              }
            }
          ).sort({ score: { $meta: "textScore" } });
        }
      });

    }

  });
  /*----------------------- API For Filters : Start --------------------*/
  app.get("/api/filter/:_filterData/sort/:_sortData/restaurantcategory/:_restaurantcategory/dietarytype/:_dietarytype/lat/:_lat/long/:_long/discount/:_seletcedDiscount", function (req, res) {
    var filterData = req.params._filterData;
    var sortData = req.params._sortData;
    var dietarytype = req.params._dietarytype;
    var seletcedDiscount = req.params._seletcedDiscount;
    var restaurantcategory = req.params._restaurantcategory;
    var userLat = req.params._lat;
    var userLong = req.params._long;
    var dietarytypeArr = []; var restaurantcategoryArr = [];
    var discountArr = [];
    var restaurtantCategoryDietryQry = {};
    var restaurantCategoryQuery = {};
    var offerQuery = {};
    if (restaurantcategory != 'none') {
      restaurantcategoryArr = restaurantcategory.split(',');
      restaurantCategoryQuery = {
          RestaurantCategoryId: { $in: restaurantcategoryArr }
      }
    }
    
    if (dietarytype != 'none') {
      dietarytypeArr = dietarytype.split(',');
      restaurtantCategoryDietryQry = { DietaryType: { $in: dietarytypeArr } }
      restaurantCategoryQuery = {
        RestaurantCategoryId: { $in: restaurantcategoryArr }, DietaryType: { $in: dietarytypeArr }
      }
    }
    var filterDataArr = filterData.split(",");
    var filterDataArrLen = filterDataArr.length;

    checkData = [];
    resultantData = {};
    filterDataArr.forEach(function (element, i) {
      if (seletcedDiscount != 'none') {
        discountArr = seletcedDiscount.split(',');
        offerQuery = { Discount: { $in: discountArr } };
        Offer.find(offerQuery, function (error, offerResult) {
          if (error) {
            sendError(error, res);
          }
          else {
            var offerResultLen = offerResult.length;
            var restaurantWithOffer = [];
            if (offerResultLen > 0) {
              offerResult.forEach(function (object, offerInd) {
                if (!restaurantWithOffer.includes(object.RestaurantId)) {
                  restaurantWithOffer.push(object.RestaurantId);
                }
                if (offerInd == (offerResultLen - 1)) {
                  restaurantCategoryQuery._id = { $in: restaurantWithOffer }
                  if (element == 'restaurantcategory') {
                    Restaurant.find(
                      restaurantCategoryQuery, function (error, response) {
                        if (error) {
                          sendError(error, res);
                        }
                        else {
                          var restaurantCategoryResult = [];
                          var responseLen = response.length;
                          if (responseLen > 0) {
                            var distanceLimit;
                            response.forEach(function (e, index) {
                              if (sortData.indexOf("distance") > -1) {
                                distanceLimit = sortData.split(",")[1].trim();
                                var lati = response[index].Lat;
                                var longi = response[index].Long;
                                var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                                response[index].Distance = dist ? dist : 0;
                              }
                              if (index == (responseLen - 1)) {
                                var finalResult = response;
                                if (distanceLimit) {
                                  finalResult = response.filter((x) => { return x.Distance <= distanceLimit });
                                  finalResult.sort(function (a, b) {
                                    return ((b.Distance - a.Distance)) // descending order
                                  });
                                };
                                if (finalResult.length == 0) {
                                  resultantData.Restaurant = finalResult;
                                  //checkData.push("restaurantcategory");
                                  sendSuccessResponse(resultantData, '', res);
                                  //sendResponse(filterDataArrLen, res);
                                } else {
                                  finalResult.forEach(function (ele, ind) {
                                    RestaurantReview.aggregate(
                                      [
                                        { "$match": { "RestaurantId": ObjectId(ele._id) } },
                                        { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                                      ], function (err, resReviewResult) {
                                        finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                                        restaurantCategoryResult.push(finalResult[ind]);
                                        if (restaurantCategoryResult.length == (finalResult.length)) {
                                          if (sortData.indexOf("toprated") > -1) {
                                            finalResult.sort(function (a, b) {
                                              return ((b.Rating - a.Rating)) // descending order
                                            });
                                          }
                                          console.log(resultantData);
                                          resultantData.Restaurant = finalResult;
                                          checkData.push("restaurantcategory");
                                          sendSuccessResponse(resultantData, '', res);
                                          //sendResponse(filterDataArrLen, res);
                                        }
                                      });
                                  });
                                }

                              }
                            });
                          }
                          else if (response.length == 0) {
                            checkData.push("restaurantcategory");
                            resultantData.Restaurant = restaurantCategoryResult;
                            sendSuccessResponse(resultantData, '', res);
                            //sendResponse(filterDataArrLen, res);
                          }
                        }
                      }
                    );
                  }
                  if (element == 'dietarytype') {
                    if (filterDataArrLen == 1) {
                      var dietaryTypeResult = [];
                      Restaurant.find(restaurtantCategoryDietryQry, function (err, response) {
                        if (err)
                          sendError(err, res);
                        else {
                          var distanceLimit; var responseLen = response.length;
                          var restaurantCategoryResult = [];

                          response.forEach(function (e, index) {
                            if (sortData.indexOf("distance") > -1) {
                              distanceLimit = sortData.split(",")[1].trim();
                              var lati = response[index].Lat;
                              var longi = response[index].Long;
                              var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                              response[index].Distance = dist ? dist : 0;
                            }
                            if (index == (responseLen - 1)) {
                              var finalResult = response;
                              if (distanceLimit) {
                                finalResult = response.filter((x) => { return x.Distance <= distanceLimit });
                                finalResult.sort(function (a, b) {
                                  return ((b.Distance - a.Distance)) // descending order
                                });
                              };
                              if (finalResult.length == 0) {
                                resultantData.Restaurant = finalResult;
                                sendSuccessResponse(resultantData, '', res);
                                //checkData.push("dietarytype");
                                //sendResponse(filterDataArrLen, res);
                              } else {
                                finalResult.forEach(function (ele, ind) {
                                  RestaurantReview.aggregate(
                                    [
                                      { "$match": { "RestaurantId": ObjectId(ele._id) } },
                                      { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                                    ], function (err, resReviewResult) {
                                      finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                                      restaurantCategoryResult.push(finalResult[ind]);
                                      if (restaurantCategoryResult.length == (finalResult.length)) {
                                        if (sortData.indexOf("toprated") > -1) {
                                          finalResult.sort(function (a, b) {
                                            return ((b.Rating - a.Rating)) // descending order
                                          });
                                        }
                                        resultantData.Restaurant = finalResult;
                                        sendSuccessResponse(resultantData, '', res);
                                        //checkData.push("dietarytype");
                                        //sendResponse(filterDataArrLen, res);
                                      }
                                    });
                                });
                              }

                            }
                          });
                        }
                      });
                    } else {
                      checkData.push("dietarytype");
                    }

                  }
                  if (element == 'none') {
                    Restaurant.find(
                      restaurantCategoryQuery, function (error, response) {
                        if (error) {
                          sendError(error, res);
                        }
                        else {
                          var restaurantCategoryResult = [];
                          var responseLen = response.length;
                          if (responseLen > 0) {
                            var distanceLimit;
                            response.forEach(function (e, index) {
                              if (sortData.indexOf("distance") > -1) {
                                distanceLimit = sortData.split(",")[1].trim();
                                var lati = response[index].Lat;
                                var longi = response[index].Long;
                                var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                                response[index].Distance = dist ? dist : 0;
                              }
                              if (index == (responseLen - 1)) {
                                var finalResult = response;
                                if (distanceLimit) {
                                  finalResult = response.filter((x) => { return x.Distance <= distanceLimit });
                                  finalResult.sort(function (a, b) {
                                    return ((b.Distance - a.Distance)) // descending order
                                  });
                                };
                                if (finalResult.length == 0) {
                                  resultantData.Restaurant = finalResult;
                                  sendSuccessResponse(resultantData, '', res);
                                  //checkData.push("none");
                                  //sendResponse(filterDataArrLen, res);
                                } else {
                                  finalResult.forEach(function (ele, ind) {
                                    RestaurantReview.aggregate(
                                      [
                                        { "$match": { "RestaurantId": ObjectId(ele._id) } },
                                        { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                                      ], function (err, resReviewResult) {
                                        finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                                        restaurantCategoryResult.push(finalResult[ind]);
                                        if (restaurantCategoryResult.length == (finalResult.length)) {
                                          if (sortData.indexOf("toprated") > -1) {
                                            finalResult.sort(function (a, b) {
                                              return ((b.Rating - a.Rating)) // descending order
                                            });
                                          }
                                          resultantData.Restaurant = finalResult;
                                          sendSuccessResponse(resultantData, '', res);
                                          //checkData.push("none");
                                          //sendResponse(filterDataArrLen, res);
                                        }
                                      });
                                  });
                                }

                              }

                            });
                          }
                          else if (response.length == 0) {
                            checkData.push("none");
                            resultantData.Restaurant = restaurantCategoryResult;
                            sendResponse(filterDataArrLen, res);
                          }
                        }
                      }
                    );
                  }
                }
              });
            }
            else {
              resultantData.Restaurant = [];
              sendSuccessResponse(resultantData, '', res);
            }
          }
        });
      } else {
        if (element == 'restaurantcategory') {
          Restaurant.find(
            restaurantCategoryQuery, function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var restaurantCategoryResult = [];
                var responseLen = response.length;
                if (responseLen > 0) {
                  var distanceLimit;
                  response.forEach(function (e, index) {
                    if (sortData.indexOf("distance") > -1) {
                      distanceLimit = sortData.split(",")[1].trim();
                      var lati = response[index].Lat;
                      var longi = response[index].Long;
                      var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                      response[index].Distance = dist ? dist : 0;
                    }
                    if (index == (responseLen - 1)) {
                      var finalResult = response;
                      if (distanceLimit) {
                        finalResult = response.filter((x) => { return x.Distance <= distanceLimit });
                        finalResult.sort(function (a, b) {
                          return ((b.Distance - a.Distance)) // descending order
                        });
                      };
                      if (finalResult.length == 0) {
                        resultantData.Restaurant = finalResult;
                        //checkData.push("restaurantcategory");
                        sendSuccessResponse(resultantData, '', res);
                        //sendResponse(filterDataArrLen, res);
                      } else {
                        finalResult.forEach(function (ele, ind) {
                          RestaurantReview.aggregate(
                            [
                              { "$match": { "RestaurantId": ObjectId(ele._id) } },
                              { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                            ], function (err, resReviewResult) {
                              finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                              restaurantCategoryResult.push(finalResult[ind]);
                              if (restaurantCategoryResult.length == (finalResult.length)) {
                                if (sortData.indexOf("toprated") > -1) {
                                  finalResult.sort(function (a, b) {
                                    return ((b.Rating - a.Rating)) // descending order
                                  });
                                }
                                console.log(resultantData);
                                resultantData.Restaurant = finalResult;
                                checkData.push("restaurantcategory");
                                sendSuccessResponse(resultantData, '', res);
                                //sendResponse(filterDataArrLen, res);
                              }
                            });
                        });
                      }

                    }
                  });
                }
                else if (response.length == 0) {
                  checkData.push("restaurantcategory");
                  resultantData.Restaurant = restaurantCategoryResult;
                  sendSuccessResponse(resultantData, '', res);
                  //sendResponse(filterDataArrLen, res);
                }
              }
            }
          );
        }
        if (element == 'dietarytype') {
          if (filterDataArrLen == 1) {
            var dietaryTypeResult = [];
            Restaurant.find(restaurtantCategoryDietryQry, function (err, response) {
              if (err)
                sendError(err, res);
              else {
                var distanceLimit; var responseLen = response.length;
                var restaurantCategoryResult = [];

                response.forEach(function (e, index) {
                  if (sortData.indexOf("distance") > -1) {
                    distanceLimit = sortData.split(",")[1].trim();
                    var lati = response[index].Lat;
                    var longi = response[index].Long;
                    var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                    response[index].Distance = dist ? dist : 0;
                  }
                  if (index == (responseLen - 1)) {
                    var finalResult = response;
                    if (distanceLimit) {
                      finalResult = response.filter((x) => { return x.Distance <= distanceLimit });
                      finalResult.sort(function (a, b) {
                        return ((b.Distance - a.Distance)) // descending order
                      });
                    };
                    if (finalResult.length == 0) {
                      resultantData.Restaurant = finalResult;
                      sendSuccessResponse(resultantData, '', res);
                      //checkData.push("dietarytype");
                      //sendResponse(filterDataArrLen, res);
                    } else {
                      finalResult.forEach(function (ele, ind) {
                        RestaurantReview.aggregate(
                          [
                            { "$match": { "RestaurantId": ObjectId(ele._id) } },
                            { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                          ], function (err, resReviewResult) {
                            finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                            restaurantCategoryResult.push(finalResult[ind]);
                            if (restaurantCategoryResult.length == (finalResult.length)) {
                              if (sortData.indexOf("toprated") > -1) {
                                finalResult.sort(function (a, b) {
                                  return ((b.Rating - a.Rating)) // descending order
                                });
                              }
                              resultantData.Restaurant = finalResult;
                              sendSuccessResponse(resultantData, '', res);
                              //checkData.push("dietarytype");
                              //sendResponse(filterDataArrLen, res);
                            }
                          });
                      });
                    }

                  }
                });
              }
            });
          } else {
            checkData.push("dietarytype");
          }

        }
        if (element == 'none') {
          Restaurant.find(
            restaurantCategoryQuery, function (error, response) {
              if (error) {
                sendError(error, res);
              }
              else {
                var restaurantCategoryResult = [];
                var responseLen = response.length;
                if (responseLen > 0) {
                  var distanceLimit;
                  response.forEach(function (e, index) {
                    if (sortData.indexOf("distance") > -1) {
                      distanceLimit = sortData.split(",")[1].trim();
                      var lati = response[index].Lat;
                      var longi = response[index].Long;
                      var dist = geodist({ lat: userLat, lon: userLong }, { lat: lati, lon: longi }, { exact: true, unit: 'km' });
                      response[index].Distance = dist ? dist : 0;
                    }
                    if (index == (responseLen - 1)) {
                      var finalResult = response;
                      if (distanceLimit) {
                        finalResult = response.filter((x) => { return x.Distance <= distanceLimit });
                        finalResult.sort(function (a, b) {
                          return ((b.Distance - a.Distance)) // descending order
                        });
                      };
                      if (finalResult.length == 0) {
                        resultantData.Restaurant = finalResult;
                        sendSuccessResponse(resultantData, '', res);
                      } else {
                        finalResult.forEach(function (ele, ind) {
                          RestaurantReview.aggregate(
                            [
                              { "$match": { "RestaurantId": ObjectId(ele._id) } },
                              { $group: { _id: "$RestaurantId", Stars: { $avg: "$Stars" } } }, { $sort: { Stars: -1 } }
                            ], function (err, resReviewResult) {
                              finalResult[ind].Rating = resReviewResult.length > 0 ? resReviewResult[0].Stars : 0;
                              restaurantCategoryResult.push(finalResult[ind]);
                              if (restaurantCategoryResult.length == (finalResult.length)) {
                                if (sortData.indexOf("toprated") > -1) {
                                  finalResult.sort(function (a, b) {
                                    return ((b.Rating - a.Rating)) // descending order
                                  });
                                }
                                resultantData.Restaurant = finalResult;
                                sendSuccessResponse(resultantData, '', res);
                              }
                            });
                        });
                      }

                    }

                  });
                }
                else if (response.length == 0) {
                  checkData.push("none");
                  resultantData.Restaurant = restaurantCategoryResult;
                  sendResponse(filterDataArrLen, res);
                }
              }
            }
          );
        }
      }

 
    });

  });

}
