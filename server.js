
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
    userId    : 'u-',
    apiToken  : 't-',
    apiSecret : ''
};
const bandwidthAPI = new Bandwidth(myCreds);

/* Serve our lil website */
app.get("/", function (req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/pearl-hacks", function(req, res) {
    res.send("Pearl Hacks");
})


app.post("/api/incoming-messages", function (req, res){
    const messageBody = req.body;
    console.log(messageBody);
    res.send(200);
    const myRequest = req.body.text;

    bandwidthAPI.Message.send({
        to: req.body.from,
        from: req.body.to,
        text: "Thank you for sending a text messages"
    })
    .then(function (result){
        console.log(result);
    })
    .catch(function (error){
        console.log(error);
    });
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