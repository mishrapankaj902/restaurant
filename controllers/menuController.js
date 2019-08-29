module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
    var mongoose = require('mongoose');
    const stringify = require('json-stringify-safe')

    var Image = require('../model/Image');
    var Menu = require('../model/Menu');
    var Product = require('../model/Product');
    var MenuCategory = require('../model/MenuCategory');
    var Restaurant = require('../model/Restaurant');

    app.get('/api/menu', function (req, res) {
        var resultData = [];
        var prd = [];
        Menu.find({}, function (err, result) {
            if (err)
                sendError(err, res);

            else {
                Product.find({}, function (err, products) {
                    if (!err) {
                        MenuCategory.find({}, function (err, menuCategories) {
                            if (!err) {
                                Restaurant.find({}, function (err, restaurant) {
                                    if (!err) {
                                        result.forEach(function (element) {
                                           
                                            resultData.push({
                                                Menu: element,
                                                Product: products.filter(p=>p._id == element.ProductId.toString())[0],
                                                Restaurant: restaurant.filter(p=>p._id == element.RestaurantId.toString())[0],
                                                MenuCategory: menuCategories.filter(p=>p._id == element.MenuCategoryId.toString())[0]
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
                    else
                        sendError(err, res);
                });
            }
        });
    });

    app.get('/api/restaurant/:_id/menu', function (req, res) {
        var Id = req.params._id;
        var resultData = [];
        var prd = [];
        Menu.find({ RestaurantId: Id }, function (err, result) {
            if (err)
                sendError(err, res);

            else {
                Product.find({}, function (err, products) {
                    if (!err) {
                        MenuCategory.find({}, function (err, menuCategories) {
                            if (!err) {
                              Restaurant.find({}, function (err, restaurant) {
                                    if (!err) {
                                        result.forEach(function (element) {

                                            resultData.push({
                                                Menu: element,
                                                Product: products.filter(p=>p._id == element.ProductId.toString())[0],
                                                Restaurant: restaurant.filter(p=>p._id == element.RestaurantId.toString())[0],
                                                MenuCategory: menuCategories.filter(p=>p._id == element.MenuCategoryId.toString())[0]
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
                    else
                        sendError(err, res);
                });
            }
        });
    });

    //app.get('/api/menu', function (req, res) {
    //    Menu.find({}, function (err, result) {
    //        if (err)
    //            sendError(err, res);
    //        else {

    //            result.forEach(function (element) {
    //                result
    //            })

    //            sendSuccessResponse(result, '', res);
    //        }
    //    });
    //});

    app.get('/api/menu/:_id', function (req, res) {
        var Id = req.params._id;
        resultData = {};
        Menu.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                Product.find({ _id: result[0].ProductId.toString() }, function (err, products) {
                    if (!err) {
                        MenuCategory.find({ _id: result[0].MenuCategoryId.toString() }, function (err, menuCategories) {
                            if (!err) {
                                Restaurant.find({ _id: result[0].RestaurantId.toString() }, function (err, restaurant) {
                                    if (!err) {
                                        resultData.Menu = result[0];
                                        resultData.Product = products[0];
                                        resultData.Restaurant = restaurant[0];
                                        resultData.MenuCategory = menuCategories[0];
                                        sendSuccessResponse(resultData, '', res);
                                    }

                                });
                            }
                        });

                    }
                });
        });
    });

    app.post('/api/menu', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {
            var newMenu = new Menu({
                _id: new mongoose.Types.ObjectId,
                Name: req.body.Name,
                MenuCategoryId: req.body.MenuCategoryId,
                ProductId: req.body.ProductId,
                RestaurantId: req.body.RestaurantId,
                CreatedDate: new Date(),
                ModifiedDate: new Date(),
                Description: req.body.Description,
                PriceDelivery: req.body.PriceDelivery,
                CostExcelTax: req.body.CostExcelTax,
                TaxLevel: req.body.TaxLevel,
                TaxLevelTakeAway: req.body.TaxLevelTakeAway,
                TaxLevelDelivery: req.body.TaxLevelDelivery,
                Barcode: req.body.Barcode,
				        DiscountEvent:req.body.DiscountEvent,
                ReductionAmount: req.body.ReductionAmount,
                RunTimeEventDate: req.body.RunTimeEventDate,
                RunTimeEventTime: req.body.RunTimeEventTime,
                RecurreningEvent: req.body.RecurreningEvent,
                DietaryType: req.body.DietaryType
            });

            newMenu.save(function (err, users) {
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

    app.put('/api/menu', jsonParser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateMenu = new Menu();

                updateMenu._id = req.body._id;
                updateMenu.Name = req.body.Name;
                updateMenu.MenuCategoryId = req.body.MenuCategoryId;
                updateMenu.ProductId = req.body.ProductId;
                updateMenu.RestaurantId = req.body.RestaurantId;
                updateMenu.ModifiedDate = new Date();
                updateMenu.Description= req.body.Description,
                updateMenu.PriceDelivery= req.body.PriceDelivery,
                updateMenu.CostExcelTax= req.body.CostExcelTax,
                updateMenu.TaxLevel= req.body.TaxLevel,
                updateMenu.TaxLevelTakeAway= req.body.TaxLevelTakeAway,
                updateMenu.TaxLevelDelivery= req.body.TaxLevelDelivery,
                updateMenu.Barcode= req.body.Barcode,
				        updateMenu.DiscountEvent=req.body.DiscountEvent,
                updateMenu.ReductionAmount= req.body.ReductionAmount,
                updateMenu.RunTimeEventDate= req.body.RunTimeEventDate,
                updateMenu.RunTimeEventTime= req.body.RunTimeEventTime,
                updateMenu.RecurreningEvent = req.body.RecurreningEvent,
                updateMenu.DietaryType= req.body.DietaryType

                Menu.update({ "_id": req.body._id }, updateMenu, function (err, categories) {
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

    app.delete('/api/menu/:_id', function (req, res) {
        var Id = req.params._id;
        Menu.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
    });

    //app.post('/api/menu/upload/:_id/imageupload', function (req, res) {
    //    var Id = req.params._id;
    //    console.log(req.files.ImageFile[0]);
    //    var listImage = [];
    //    if (Id != '') {
    //        if (!req.files)
    //            sendError({ message: 'No files were uploaded.' }, res);
    //        else {
    //            if (req.files.ImageFile == null || req.files.ImageFile == undefined)
    //                sendError({ message: 'Please send correct param ImageFile' }, res);
    //            else {
    //                if (req.files.ImageFile[0] != undefined)
    //                {
    //                    for (var i = 0; i < req.files.ImageFile.length; i++) {
    //                        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //                        let sampleFile = req.files.ImageFile[i];
    //                        console.log(sampleFile.name);
    //                        if (sampleFile != undefined) {
    //                            var imagePath = imageDir + sampleFile.name;
    //                            // Use the mv() method to place the file somewhere on your server
    //                            sampleFile.mv(imagePath, function (err) {
    //                                if (err)
    //                                    sendError(err, res);
    //                                else {
    //                                    var newImage = new Image({
    //                                        _id: new mongoose.Types.ObjectId,
    //                                        EntityType: "Menu",
    //                                        EntityId: Id,
    //                                        Name: sampleFile.name,
    //                                        Path: imageServer + sampleFile.name,
    //                                        CreatedDate: new Date(),
    //                                        ModifiedDate: new Date()
    //                                    })

    //                                    newImage.save(function (err, users) {
    //                                        if (err != null) {
    //                                            sendError(err, res);
    //                                        }
    //                                        else {
    //                                            if (users != null) {
    //                                                listImage.push(newImage);
    //                                                console.log(newImage._id);
    //                                                console.log(listImage.length);

    //                                                if (listImage.length == req.files.ImageFile.length) {
    //                                                    console.log('done');
    //                                                    sendSuccessResponse("", 'File uploaded successfully Count- ' + listImage.length, res);
    //                                                }
    //                                            }
    //                                        }
    //                                    });
    //                                }
    //                            });
    //                        }
    //                    }
    //                }
    //                else if (req.files.ImageFile!=undefined) {
    //                    let sampleFile = req.files.ImageFile;
    //                    console.log(sampleFile.name);
    //                    if (sampleFile != undefined) {
    //                        var imagePath = imageDir + sampleFile.name;
    //                        // Use the mv() method to place the file somewhere on your server
    //                        sampleFile.mv(imagePath, function (err) {
    //                            if (err)
    //                                sendError(err, res);
    //                            else {
    //                                var newImage = new Image({
    //                                    _id: new mongoose.Types.ObjectId,
    //                                    EntityType: "Menu",
    //                                    EntityId: Id,
    //                                    Name: sampleFile.name,
    //                                    Path: imageServer + sampleFile.name,
    //                                    CreatedDate: new Date(),
    //                                    ModifiedDate: new Date()
    //                                })

    //                                newImage.save(function (err, users) {
    //                                    if (err != null) {
    //                                        sendError(err, res);
    //                                    }
    //                                    else {
    //                                        if (users != null) {
    //                                            console.log(newImage._id);
    //                                            sendSuccessResponse("", 'File uploaded successfully - ' + sampleFile.name, res);
    //                                        }
    //                                    }
    //                                });
    //                            }
    //                        });
    //                    }
    //                }
                    
    //            }
    //        }

    //    } else
    //        sendError({ message: 'Please send restaurant Id' }, res);
    //});

  app.get('/api/getmenu/restaurant/:_id', function (req, res) {
    var Id = req.params._id;
    var resultant = {};
    var resultData = [];
    var prd = [];
    Menu.find({ RestaurantId: Id }, function (err, result) {
      if (err)
        sendError(err, res);

      else {
        Product.find({}, function (err, products) {
          if (!err) {
            MenuCategory.find({}, function (err, menuCategories) {
              if (!err) {
               
                menuCategories.forEach(function (categoryElement) {
                  var menuCategoryName = categoryElement.Name;
                  var itemsList = {}; var items = [];
                  resultant[menuCategoryName] = items;
                  var menu = result.filter(p => p.MenuCategoryId == categoryElement._id.toString());

                  menu.forEach(function (ele) {
                    items.push({
                      Menu: ele,
                      Product: products.filter(p => p._id == ele.ProductId.toString())[0],
                    });
                  });

                  itemsList.Category = categoryElement.Name;
                  itemsList.Items = items;

                  resultant["" + menuCategoryName + ""] = itemsList;
                });

                sendSuccessResponse(resultant, '', res);
                 
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
}
