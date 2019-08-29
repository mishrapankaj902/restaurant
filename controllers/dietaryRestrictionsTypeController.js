module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
  var mongoose = require('mongoose');
  var DietaryRestrictions = require('../model/DietaryRestrictionsType');

  app.get('/api/dietaryRestrictions',function (req, res) {
    DietaryRestrictions.find({},function (err, result) {
      if (err)
        sendError(err, res);
      else
        sendSuccessResponse(result, '', res);
    });
  });

  app.post('/api/dietaryRestrictions', jsonParser, function (req, res) {
    if (req.body != null && req.body != undefined) {
      var newDietaryType = new DietaryRestrictions({
        _id: new mongoose.Types.ObjectId,
        DietaryName: req.body.DietaryName,
        DietaryValue: req.body.DietaryValue,
        CreatedDate: new Date(),
        ModifiedDate: new Date()
      });

      newDietaryType.save(function (err, users) {
        if (err != null) {
          sendError(err, res);
        }
        else {
            sendSuccessResponse(users, 'Added Successfully', res);
        }
      });
    } else {
      sendError({ message: 'Request body is null' }, res);
    }
  });
}
