module.exports = function (app, urlencodedBodyparser, jsonParser, sendSuccessResponse, sendError, imageDir, imageServer, VerifyToken) {
    var mongoose = require('mongoose');
    const stringify = require('json-stringify-safe')
    var mailer = require('express-mailer');
    var Image = require('../model/Image');
    var User = require('../model/User');
    const uuidv1 = require('uuid/v1');
    var bcrypt = require('bcryptjs');
    const ObjectId = mongoose.Types.ObjectId;
    mailer.extend(app, {
        from: 'amriksingh.kis@gmail.com',
        host: 'smtp.gmail.com', // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: 'amriksingh.kis@gmail.com',
            pass: 'krish.341@ak'
        }
    });

    app.get('/api/forgotpassword/:email', function (req, res) {
        const v1options = {
            node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
            clockseq: 0x1234,
            msecs: new Date().getTime(),
            nsecs: 5678
        };
        console.log(uuidv1(v1options));
        console.log(req.params.email);
        var emailAddress = req.params.email;
        if (emailAddress != null && emailAddress != undefined && emailAddress != '') {
            User.find({ EmailAddress: emailAddress }, function (err, result) {
                if (err)
                    sendError(err, res);
                else {
                    if (result[0] != undefined && result[0] != null) {

                        var mailOptions = {
                            to: emailAddress,
                            subject: 'Password reset email',
                            user: {  // data to view template, you can access as - user.name
                                name: result[0].FullName,
                                message: 'Welcome',
                                url: "http://112.196.24.205:3000/forgetpassword/" + result[0].UUID
                            }
                        }

                        app.mailer.send('email', mailOptions, function (err) {
                            if (err) {
                                sendError(err, res);
                                return;
                            }
                            else {
                                sendSuccessResponse("", 'Email Sent', res);
                            }
                        });
                    }
                    else {
                        sendError({ message: 'No user found for this email address' }, res);
                    }
                }
            });

        }
        else {
            sendError({ message: 'Email Address is Required' }, res);
        }
    });

    app.get('/api/images/:_id/:entity', function (req, res) {

        var Id = req.params._id;
        var Entity = req.params.entity;

        Image.find({ EntityId: Id, EntityType: Entity }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, '', res);
        });
    });

    app.post('/api/upload/:entity/:_id/image', function (req, res) {
        var Id = req.params._id;
        var Entity = req.params.entity;
        console.log(req.files.ImageFile[0]);
        var listImage = [];
        if (Id != '') {
            if (!req.files)
                sendError({ message: 'No files were uploaded.' }, res);
            else {
                if (req.files.ImageFile == null || req.files.ImageFile == undefined)
                    sendError({ message: 'Please send correct param ImageFile' }, res);
                else {
                    if (req.files.ImageFile[0] != undefined) {
                        for (var i = 0; i < req.files.ImageFile.length; i++) {
                            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                            let sampleFile = req.files.ImageFile[i];
                            console.log(sampleFile.name);
                            if (sampleFile != undefined) {
                                var imagePath = imageDir + sampleFile.name;
                                // Use the mv() method to place the file somewhere on your server
                                sampleFile.mv(imagePath, function (err) {
                                    if (err)
                                        sendError(err, res);
                                    else {
                                        var newImage = new Image({
                                            _id: new mongoose.Types.ObjectId,
                                            EntityType: Entity,
                                            EntityId: Id,
                                            Name: sampleFile.name,
                                            Path: imageServer + sampleFile.name,
                                            CreatedDate: new Date(),
                                            ModifiedDate: new Date()
                                        })

                                        newImage.save(function (err, users) {
                                            if (err != null) {
                                                sendError(err, res);
                                            }
                                            else {
                                                if (users != null) {
                                                    listImage.push(newImage);
                                                    console.log(newImage._id);
                                                    console.log(listImage.length);

                                                    if (listImage.length == req.files.ImageFile.length) {
                                                        console.log('done');
                                                        sendSuccessResponse("", 'File uploaded successfully Count- ' + listImage.length, res);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                    else if (req.files.ImageFile != undefined) {
                        let sampleFile = req.files.ImageFile;
                        console.log(sampleFile.name);
                        if (sampleFile != undefined) {
                            var imagePath = imageDir + sampleFile.name;
                            // Use the mv() method to place the file somewhere on your server
                            sampleFile.mv(imagePath, function (err) {
                                if (err)
                                    sendError(err, res);
                                else {
                                    var newImage = new Image({
                                        _id: new mongoose.Types.ObjectId,
                                        EntityType: Entity,
                                        EntityId: Id,
                                        Name: sampleFile.name,
                                        Path: imageServer + sampleFile.name,
                                        CreatedDate: new Date(),
                                        ModifiedDate: new Date()
                                    })

                                    newImage.save(function (err, users) {
                                        if (err != null) {
                                            sendError(err, res);
                                        }
                                        else {
                                            if (users != null) {
                                                console.log(newImage._id);
                                                sendSuccessResponse("", 'File uploaded successfully - ' + sampleFile.name, res);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            }

        } else
            sendError({ message: 'Please send restaurant Id' }, res);
    });


    app.delete('/api/image/:_id', function (req, res) {
        var Id = req.params._id;
        Image.findOneAndDelete({ _id: Id }, function (err, result) {
            if (err)
                sendError(err, res);
            else
                sendSuccessResponse(result, 'Deleted Successfully', res);
        });
    });

    app.post('/api/user/updatepassword', jsonParser, function (req, res) {
       
        if (req.body != null && req.body != undefined) {
            var hashedPassword = bcrypt.hashSync(req.body.Password, 8);
            console.log("hashed password :" + hashedPassword);
           var id= req.body._id;
            User.update(
                   { '_id': id }, //find criteria
                   
                   {
                       $set: { 'Password': hashedPassword }
                   }, function (err, users) {
                       if (err != null) {
                           sendError(err, res);
                       }
                       else {
                           if (users != null) {
                               sendSuccessResponse(users, 'updated Successfully', res);
                           }
                           else {
                               sendError({ message: 'Failed to update Restaurant Tips' }, res);
                           }
                       }
                   });
         
        } else {
            sendError({ message: 'Request body is null' }, res);
        }
    });
}
