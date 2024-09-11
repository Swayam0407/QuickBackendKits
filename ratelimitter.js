const express = require("express");
const app = express();

let numberOfUserRequests = {};

setInterval(() => {
  numberOfUserRequests={}
}, 1000);

function ratelimitter(req,res,next){
  const userId = req.headers['user-id'];

  if(!userId){
    return res.status(404).send("Could not find");
  }

  if(!numberOfUserRequests[userId]){
    numberOfUserRequests[userId]=0;
  }

  numberOfUserRequests[userId]++;

  if(numberOfUserRequests[userId]>5){
    return res.status(429).send("Too many requests..");
  }

  next();
}


app.get("/",function(req,res){
  res.send("Hello there!");
});

app.use(ratelimitter);

app.get("/user", function(req,res){
  res.status(200).json({name:"swayam"});
});

app.post("/user", function(req,res){
  res.status(200).json({message:"created by test user"});
});

app.listen(3000,function(){
  console.log("Server running at port 3000");
});

module.exports=app;