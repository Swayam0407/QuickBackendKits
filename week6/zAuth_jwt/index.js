const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const JWT_SECRET = "swayamisagiidboy";

app.use(express.json());

const users = [];

function auth(req, res, next){
    const token = req.headers.token //extract token
    const decodedToken = jwt.verify(token, JWT_SECRET); //verify

    if(decodedToken.username){
        req.username = decodedToken.username;
        next();
    }
    else{
        res.json({
            message:"doesnt exist"
        })
    }
}

function logger(req, res, next){
     console.log(`Request came: ${req.method}`);
     next();
}

app.get("/", function(req,res){
    res.sendFile(__dirname+"/public/index.html");
})


app.post("/signup", logger, function(req,res){

    const username = req.body.username;
    const password = req.body.password;


    users.push({
        username:username,
        password:password
    })

    res.json({
        message: "you are signed in",
    })
    

})

app.post("/signin", logger,  function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for(let i=0;i<users.length;i++){
        if( users[i].username === username && users[i].password === password){
            foundUser = users[i];
        }
    }

    if(!foundUser){
        res.json({
            message: "not found"
        })
        return;
    }
    else{
        const token = jwt.sign({
            username:foundUser.username
        }, JWT_SECRET);
        res.header("jwt", token);

        res.json({
            token: token
        })

    }


})

app.get("/me", logger, auth,  function(req,res){


    if(req.username){
        let foundUser = null;

        for(let i = 0; i<users.length;i++){
            if(users[i].username === req.username){
                foundUser=users[i];
            }
        }

        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }

})

app.listen(3000);



