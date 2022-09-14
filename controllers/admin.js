var express = require('express');
var Tool = require("../TOOL");

const User = require("../mongoDB/models/users");
const Location = require("../mongoDB/models/locations");

const app = express();
app.use(express.json());

const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

app.get("/", (req,res)=>{
  try{
    res.write("Welcome!\n");
    res.write("Admin panel....");
    res.end();
  }catch(err){
    console.log(err);
  }
});

app.post("/register",async (req,res)=>{
  try{
    const {email,password} = req.body;
    if(!(email,password)){
      res.status(400).send("User already exists.");
    }
    const old = await User.findOne({email});
    if(old){
      res.status(409).send(old);
    }
    else{
      let encryptedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password:encryptedPassword,
        role:'admin'
      })
      const token = Tool.SIGN(user,email);
      user.token = token;
      res.status(201).send(user);
    }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

app.post('/login', async(req,res)=>{
  try{
    const {email,password} = req.body;
    if(!(email,password)){
      res.status(400).send("Invalid credentials");
    }else{
      const user = await User.findOne({email});
      if (user && (await bcrypt.compare(password, user.password))) {
      const token = Tool.SIGN(user,email);
      user.token = token;
      res.status(200).send(user);
    }
  }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
})

app.post('/add-location',async (req,res)=>{
  try{
    const {name,about,city,state,category,timing} = req.body;
    if(!(name,city,state)){
      res.status(400).send("Insufficient data");
    }else{
      const loc = await Location.findOne({name,city,state});
      if(loc){
        res.status(409).send("Location already added");
      }else{
        const data = await Location.create({
          name, about, city, state, category, timing
        })
        res.status(201).send(data);
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = app;
