const express = require("express");
const app = express();
const jwt  = require("jsonwebtoken")
//create a secret key
const JWT_SECRET = "randomswayamlovesjunk"


app.use(express.json());

const user =[];

app.post("/signUp", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  user.push({
    username:username,
    password:password,
  })

  res.json({
    message:"You are Signed Up!"
  })

  console.log(user);
});

app.post("/signIn", function (req, res) {
   const username = req.body.username;
   const password = req.body.password;

   let foundUser = null;

   for(let i=0;i<user.length;i++){
    if(user[i].username === username && user[i].password === password){
        foundUser = user[i];
    }
   }

   if(foundUser){
   //convert their username to a JWT and assign to user 
   const token = jwt.sign({
    username:username
   }, JWT_SECRET); //creates a jwt

    // foundUser.token = token; NOT REQUIRED AS HWT IS STATELESS
    //IT ASSIGNS ITSELF

    res.json({
        message : token
    })
   }
   else{
    res.status(403).send('User Not Found');
   }
   console.log(user);
});


//Authenticated Endpoint
app.get("/me", function(req,res){
    const token = req.headers.token; //jwt
    const decodedInformation = jwt.verify(token, JWT_SECRET); //Converting JWT back to username
    const username = decodedInformation.username;
    
    let foundUser = null;

    for(let i=0;i<user.length;i++){
        if(user[i].username === username){
            foundUser=user[i];
        }
    }

    if(foundUser){
        res.json({
            username:foundUser.username,
            password:foundUser.password,
        })
    }
    else{
        res.json({
            message: "Sorry, user not found!"
        })
    }


})


app.listen(3000, function () {
  console.log("Server running on port 3000...");
});
