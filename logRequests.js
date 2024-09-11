//  Create a middleware that logs all incoming requests to the console.

const express = require("express");
const app = express();

function logRequests(req, res, next) {
    const time = new Date();
    const timeString = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, 
    })
    console.log("method: " + req.method);
    console.log("time: " + timeString);
    console.log("url: " + req.hostname);
}

app.use(logRequests);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.listen(3000);

module.exports = app;
