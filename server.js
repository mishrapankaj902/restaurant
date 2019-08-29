var express = require('express');
var app = express();
var db = require('./model/db');
var bodyParser = require('body-parser')
var path = require('path')
const fileUpload = require('express-fileupload');
const fileType = require('file-type')
const fs = require('fs')

var userController = require('./controllers/userController');
var restaurantController = require('./controllers/restaurantController');
var menuCategoryController = require('./controllers/menuCategoryController');
var restaurantCategoryController = require('./controllers/restaurantCategoryController');
var menuController = require('./controllers/menuController');
var productController = require('./controllers/productController');
var offerController = require('./controllers/offerController');
var commonController = require('./controllers/commonController');
var orderController = require('./controllers/orderController');
var tableController = require('./controllers/tableController');
var tableReservationController = require('./controllers/tableReservationController');
var restaurantGoalController = require('./controllers/restaurantGoalController');
var restaurantTipsController = require('./controllers/restaurantTipsController');
var restaurantSpendureController = require('./controllers/restaurantSpendureController');
var restaurantReviewController = require('./controllers/restaurantReviewController');
var favouriteRestaurantController = require('./controllers/favouriteRestaurantController');
var menuReviewController = require('./controllers/menuReviewController');
var favouriteMenuController = require('./controllers/favouriteMenuController');
var popularRestaurantsController = require('./controllers/popularRestaurantsController');
var dietaryRestrictionsTypeController = require('./controllers/dietaryRestrictionsTypeController');
var VerifyToken = require('./auth/VerifyToken');

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// default options
app.use(fileUpload())

app.use(jsonParser);
app.use(urlencodedParser);

let response = {
    status: 200,
    data: [],
    token: '',
    message: null
};

// Error handling
const sendError = (err, res) => {
    response.status = 500;
    response.data = [],
    response.token = '',
    response.message = typeof err == 'object' && err != null ? err.message : err;
    res.status(500).json(response);
};

const sendSuccessResponse = (data, msg, res) => {
    response.status = 200;
    response.data = data,
    response.token = '',
    response.message = msg,
    res.status(200).json(response);
};


app.get('/Images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

    res.writeHead(200, { 'Content-Type': mime })
    res.end(image, 'binary')
})


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.set('view engine', 'ejs');
app.use(express.static('./dist'));

app.use(express.static('./local'));



var imageDir = path.join(__dirname, '/Images/');
var imageServer="http://localhost:3000/Images/"
//var imageServer="http://112.196.24.205:3000/Images/"
//var imageServer = "http://134.209.87.18/Images/";

restaurantController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, imageDir,imageServer, VerifyToken);
userController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
menuCategoryController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
restaurantCategoryController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
menuController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, imageDir,imageServer,VerifyToken);
productController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
offerController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken);
orderController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken);
tableController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken);
tableReservationController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken);
commonController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken);
restaurantGoalController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
restaurantTipsController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
restaurantSpendureController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
restaurantReviewController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken); 
favouriteRestaurantController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
menuReviewController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
favouriteMenuController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
popularRestaurantsController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
dietaryRestrictionsTypeController(app, urlencodedParser, jsonParser, sendSuccessResponse, sendError, VerifyToken);
//app.get('*', function (req, res) {
//    res.sendfile('./dist/index.html')
//})

app.listen(3000);
