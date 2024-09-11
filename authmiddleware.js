

const express = require("express");
const app = express();
const VALID_API_KEY = "100xdevs_cohort3_super_secret_valid_api_key"; 


function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['api-key'];
  if(apiKey === VALID_API_KEY){
    next();
  }
  else{
    res.status(401).send("invalid api key");
  }
}

app.use(authenticateAPIKey);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Access granted" });
});

app.listen(3000);

module.exports = app;