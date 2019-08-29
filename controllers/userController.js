module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, VerifyToken) {
    var jwt = require('jsonwebtoken');
    var bcrypt = require('bcryptjs');
    var config = require('../config');
    var mongoose = require('mongoose')
    var User = require('../model/User');
    var Role = require('../model/Role');
    const uuidv1 = require('uuid/v1');
    const mollie = require('@mollie/api-client')({ apiKey: 'test_2tv7bTBdUDVka2MaMq9vBPvjezwTmx' });
    const ObjectId = mongoose.Types.ObjectId;

    app.get('/api/user/roles', function (req, res) {
        Role.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.get('/api/payment/value/:value', function(req, res){

    var value = req.params.value;
    mollie.payments.create({
        amount: {
            currency: 'EUR',
            value:    value
        },
        applicationFee: {
            description: 'Payment fee.',
            amount: {
                currency: 'EUR',
                value: '1.00'
            }
        },
        description: 'Node API',
        redirectUrl: 'https://www.mijn-menu.nl',
        webhookUrl:  'https://www.mijn-menu.nl'
    })
        .then((payment) => {
            // Forward the customer to the payment.getPaymentUrl()
            sendSuccessResponse(payment, 'working fine', res);
        })

        .catch((err) => {
            // Handle the error
            sendSuccessResponse(err, 'working fine', res);
        });
        
    });

    app.get('/api/user', VerifyToken, function (req, res) {
        User.find({}, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.get('/api/user/customer', function (req, res) {
        User.find({ "Role": "Customer" }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.get('/api/user/:_id', function (req, res) {
        var Id = req.params._id;
        User.find({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result[0], '', res);
        });
    });

    app.get('/api/user/byuuid/:_id', function (req, res) {
        var Id = req.params._id;
        User.find({ UUID: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result[0], '', res);
        });
    });

    app.put('/api/user', urlencodedBodyparser, function (req, res) {
        if (req.body != null && req.body != undefined) {

            if (req.body._id != null && req.body._id != undefined && req.body._id != '') {

                var updateUser = new User();

                updateUser._id = req.body._id;
                updateUser.FirstName = req.body.FirstName;
                updateUser.LastName = req.body.LastName;
                updateUser.FullName = req.body.FirstName + " " + req.body.LastName,
                updateUser.FireBaseId = req.body.FireBaseId;
                updateUser.Subscription = req.body.Subscription.toLowerCase();

                User.update({ "_id": req.body._id }, updateUser, function (err, users) {
                    if (err != null) {
                        sendError(err, res);
                    }
                    else {
                        if (users != null) {
                            sendSuccessResponse(users, 'Updated Successfully', res);
                        }
                        else {
                            sendError({ message: 'Failed to update' }, res);
                        }
                    }
                });
            }
            else {
                sendError({ message: 'For update user _id is required' }, res);
            }

        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });

    app.post('/api/user/login', jsonParser, function (req, res) {
        User.find({ "EmailAddress": req.body["EmailAddress"] }, function (err, users) {
            if (err != null) {
                sendError(err, res);
            } else {
                if (users != null) {
                    var count = users.length;
                    if (count > 0) {
                        var passwordIsValid = bcrypt.compareSync(req.body.Password, users[0].Password);
                        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
                        var token = jwt.sign({ id: users[0]._id }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });

                        let response = {
                            status: 200,
                            data: users[0],
                            token: token,
                            message: 'User Registered Successfully'
                        };
                        res.status(200).json(response);

                        // sendSuccessResponse(users[0], '', res);
                    }
                    else {
                        sendError({ message: 'No user found' }, res);
                        console.log("Login Failed");
                    }
                }
                else {
                    sendError({ message: 'No user found with this details' }, res);
                }
            }
        })
    });



  app.post('/api/user/register', jsonParser, function (req, res) {
        const v1options = {
            node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
            clockseq: 0x1234,
            msecs: new Date().getTime(),
            nsecs: 5678
    };
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        var newUser = new User({
            _id: new mongoose.Types.ObjectId,
            FirstName: req.body["firstName"],
            LastName: req.body["lastName"],
            FullName: req.body["firstName"] + " " + req.body["lastName"],
            EmailAddress: req.body["email"],
            Password: hashedPassword,
            FireBaseId: '1234',
            RoleId: ObjectId("5b2773f80954ed1b445445a1"),
            CreatedDate: new Date(),
            ModifiedDate: new Date(),
            Role: "Admin",
            UUID: uuidv1(v1options),
            Subscription: req.body["subscription"]
        });

        // create a token
        var token = jwt.sign({ id: newUser._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        
        newUser.save(function (err, users) {
            if (err != null) {
                sendError(err, res);
            }
            else {
                if (users != null) {
                    let response = {
                        status: 200,
                        data: users,
                        token: token,
                        message: 'User Registered Successfully'
                    };
                    res.status(200).json(response);
                    //sendSuccessResponse(users, 'User Registered Successfully', res);
                }
                else {
                    sendError(err, res);
                }
            }
        });
    });

    app.get('/api/verifyUser', function (req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(200).send({ auth: false, message: 'No token provided.', status: 200, data: null, token: token });

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return res.status(200).send({ auth: false, message: 'Failed to authenticate token.', status: 200, data: null, token: token });

            User.find({ _id: decoded.id }, function (err, user) {
                if (err) return res.status(200).send({ auth: false, message: 'There was a problem finding the user.', status: 200, data: null, token: token });
                if (!user) return res.status(200).send({ auth: false, message: 'No user found.', status: 200, data: null, token: token });
                res.status(200).send({ auth: true, message: 'User Verified', status: 200, data: user, token: token });
            });
        });
    });

    app.delete('/api/user/:_id', function (req, res) {
        var Id = req.params._id;
        User.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
    });
}
