var email = require("./path/to/emailjs/email");
var server = email.server.connect({
  user: "username",
  password: "password",
  host: "test@gmail.com",
  ssl: true
});

var message = {
  text: "i hope this works",
  from: "test@gmail.com1",
  to: "prernachouhan@krishnais.com",
  cc: "prernachouhan@krishnais.com",
  subject: "testing emailjs",
  attachment:
    [
      { data: "<html>i <i>hope</i> this works!</html>", alternative: true }
    ]
};

// send the message and get a callback with an error or details of the message that was sent
server.send(message, function (err, message) { console.log(err || message); });
