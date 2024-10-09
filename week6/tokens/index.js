const express = require("express");
const app = express();

app.use(express.json());

//returns a random long string
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

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
    const token = generateToken();
    //assign token to this user
    foundUser.token = token;
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
    const token = req.headers.token;
    let foundUser = null;

    for(let i=0;i<user.length;i++){
        if(user[i].token === token){
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


