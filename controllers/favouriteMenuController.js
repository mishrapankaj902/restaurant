module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError,VerifyToken) {
  var mongoose = require('mongoose');
  var FavouriteMenu = require('../model/Orders');
  var Product = require('../model/Product');
 
  app.get('/api/FavouriteMenu', function (req, res) {
    var resultData = [];
    var myDate = new Date();
    myDate = new Date(myDate.setMonth(myDate.getMonth() + 1));
    const currentDate = myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate();
    myDate = new Date(myDate.setDate(myDate.getDate() + 1));
    const nextDate = myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate();

    FavouriteMenu.find({ CreatedDate: { $gte: new Date(currentDate), $lt: new Date(nextDate) } }, function (err, result) {
      if (err)
        sendError(err, res);
      else {
        Product.find({}, function (err, products) {
          if (!err) {
            result.forEach(function (element) {
              element.OrderDetails.OrderdItems.forEach(function (item) {
                resultData.push({
                  Order: element,
                  Product: products.filter(p => p._id == item.ProductId.toString())[0]
                })
              });              
            })
            var data = [];
           
            sendSuccessResponse(resultData, '', res);
          }
          else {
            sendError(err, res);
          }
        })
        
      }
    });
  });
}
