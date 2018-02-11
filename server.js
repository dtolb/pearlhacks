
/* Import our Modules */
const Bandwidth  = require("node-bandwidth");
const express    = require("express");
const bodyParser = require("body-parser");
const path       = require('path');

/* Express Setup */
let app  = express();
let http = require("http").Server(app);
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

/* Setup our Bandwidth information */
const myBWNumber = '+15304470141';
const myCreds = {
    userId    : 'u-xl7bbpc5khrk3iotf6nl77q',
    apiToken  : 't-lggejwm7x2blwuqxvvmwaoq',
    apiSecret : '5f56b575ib4silvx6utszwzs2d3pfiiamwj6kla'
};
const bandwidthAPI = new Bandwidth(myCreds);

/* Serve our lil website */
app.get("/", function (req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
});

/* Answer the request to send the text message */
app.post("/send-message", function (req, res) {
    console.log(req.body);
    const messageBody = {
        to   : req.body.to,
        text : req.body.text,
        from : myBWNumber,
    }
    /* Check to see if media was sent */
    if (req.body.media !== ''){
        messageBody.media = [req.body.media];
    }
    bandwidthAPI.Message.send(messageBody)
    .then(function (bandwidthResponse) {
        res.send(bandwidthResponse);
        return;
    })
    .catch(function (error) {
        res.send(error);
        return;
    });
});

http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});