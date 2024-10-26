const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const {UserModel, TodoModel} = require('./db');
const mongoose = require('mongoose');
const JWT_SECRET = "swayamisagoodboy";
const bcrypt = require('bcrypt');
const {z} = required('zod');


mongoose.connect(
  "mongodb+srv://saggarwal1be22:t8CZZSMRpDMXGiLp@cluster0.a8y2d.mongodb.net/latest"
);  
app.use(express.json());

app.post('/signup', async function(req,res){

    const requiredBody = z.object({
      email: z.string().min(3).max(100).email(),
      password: z.string().min(3).max(100),
      name: z.string().min(3).max(100),
    });

    const parsedSuccess = requiredBody.safeParse(req.body);

    if (!parsedSuccess.success) {
      req.json({
        message: "invalid format",
        error:parsedSuccess.error
      });
      return;
    }

    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;

    const hashedPassword = await bcrypt.hash(password,5);
    console.log(hashedPassword);

    try{

    await UserModel.create({
        email:email,
        password:hashedPassword,
        name:name
    });}
    catch(e){
        res.json({
            message:"error"
        })
    }

    res.json({
        message:"you are signed up!"
    });    
});

app.post("/login", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email:email,
    })

    if(!user){
        res.json({
            message:"doesnt exist"
        })
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);


    
    if(passwordMatch){
        const token = jwt.sign({
            id : user._id.toString()
        },JWT_SECRET);

        res.json({
            token:token
        })

    }
    else{
        res.status(403).json({
            message:"invalid creds"
        })
    }
});

app.post("/todo", auth,  async function (req, res) {
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

app.get("/todos", auth,  async function (req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId : userId
    })

    res.json({
      userId: userId,
      todos: todos,
    });
});

function auth(req,res,next){
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if(decodedToken){
        req.userId = decodedToken.id;
        next();
    }
    else{
        res.status(403).json({
            message:"invalid creds"
        })
    }

}


app.listen(3000);




