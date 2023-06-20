const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
app.use(bodyParser.urlencoded({extended: true}));
//==================================================================
//ce1c484c488dff1f2e47496fb5c13ddb-us21

//Heaven's Door
//e963c6908309338e8c78923027f37bb5-us21
//List / Audience ID : 378eeb6e0e

app.use(express.static("Public"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){

    //First, acquire user information using body-parser
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var emailAddress = req.body.emailAddress;
    console.log(firstName);
    console.log(lastName);
    console.log(emailAddress);


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

    const url = "https://us21.api.mailchimp.com/3.0/lists/378eeb6e0e";
    const options = {
        method: "POST",
        auth: "jordan1:e963c6908309338e8c78923027f37bb5-us21"
    };

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log("Data went through?");
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