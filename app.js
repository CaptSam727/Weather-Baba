const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config()

const homeFile = fs.readFileSync("index.html", "utf-8");

const app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/static"));

const apikey = process.env.API_KEY;
console.log(apikey);

// Format time as (H)H:MM
function formatTime(unix_timestamp) {
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}

// Convert to Local Date
function calcTime(offset) {
    d = new Date();
    utc = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    nd = new Date(utc + (3600000 * offset));
    return nd;
}

// Formatting Date and Time
const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function formatDate(date) {
    return [
        padTo2Digits(day[date.getDay()]),
        padTo2Digits(date.getDate()),
        padTo2Digits(month[date.getMonth()])
    ].join(' ');
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/homePage.html');
});

app.post('/', (req, res) => {
    const city = req.body.cityName;
    // use own api key
    // const apikey = "";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey + "&unit=" + unit;

    https.get(url, (response) => {
        response.on("data", (data) => {
            // console.log(JSON.parse(data));
            res.render(__dirname + '/index.html', {
                data: JSON.parse(data),
                formatDate: formatDate,
                formatTime: formatTime,
                calcTime: calcTime
            });
        });
    });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});