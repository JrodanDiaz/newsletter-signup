const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const https = require("https");
require('dotenv').config();

app.use(express.static("Public"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){

    //First, acquire user information using body-parser
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var emailAddress = req.body.emailAddress;
    


    //Then, convert this data into a JSON that is readable by the API you're using
    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    //Then, send this JSON to the API

    const url = "https://us21.api.mailchimp.com/3.0/lists/" + process.env.AUDIENCE_ID;
    const options = {
        method: "POST",
        auth: "" + process.env.API_KEY
    };

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            if (response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });
    request.write(jsonData);
    request.end();


}); //END POST

app.post("/failure", function(req, res){
    res.redirect("/")
});

app.post("/refailure", function(req, res){
    res.sendFile(__dirname + "/failure.html");
});

app.post("/success", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on Port 3000!");
});