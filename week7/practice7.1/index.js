const express  = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const {UserModel, TodoModel} = require('./db');
const { default: mongoose } = require('mongoose');
const JWT_SECRET = "swayamisagoodboy";

mongoose.connect(
  "mongodb+srv://saggarwal1be22:t8CZZSMRpDMXGiLp@cluster0.a8y2d.mongodb.net/swayam3"
);

app.use(express.json());

app.post("/signup", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email:email,
        password:password,
        name:name
    })

    res.json({
        message:"signed up!"
    })
});

app.post("/login", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email:email,
        password:password
    })

    if(user){
            const token = jwt.sign(
              {
                id: user._id.toString(),
              },
              JWT_SECRET
            );

            res.json({
              token: token,
            });
    }
    else{
                res.status(403).json({
                  message: "incorrect credentials",
                });
    }

});

app.post("/todo", auth, async function (req, res) {
    const userId = req.userId;
    const title = req.body.title;

        await TodoModel.create({
        title,
        userId
    })


    res.json({
        userId:userId
    })


    
});

app.get("/todos", auth, async function (req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId : userId
    })

    res.json({
      userId: userId,
    });

});

function auth(req, res, next) {
  const token = req.headers.token;

  const decodedToken = jwt.verify(token, JWT_SECRET);

  if(decodedToken){
    req.userId=decodedToken.id;
    next();
  }
  else{
    res.status(403).json({
        message:"invalid credentials"
    })
  }
}

app.listen(3000, function(req,res){
    console.log("listening on port 3000..");
})
