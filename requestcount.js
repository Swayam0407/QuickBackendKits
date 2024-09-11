const express = require('express');
const app = express();

let requestCount = 0;

function requestCounter(req,res,next){
    requestCount++;
    console.log("RequestCount: "+requestCount);
    next();
}

app.get("/requestCount", function (req, res) {
  res.status(200).json({ requestCount });
});

app.use(requestCounter);

app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

app.post("/user", function (req, res) {
  res.status(200).json({ msg: "created dummy user" });
});


app.listen(3000);

module.exports = app;