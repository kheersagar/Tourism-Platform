import express from 'express'
import dbconnect from './mongoDB/connection.js';
import userRouter from './routes/usersRouter.js'
import superadminRouter from './routes/superadminRouter.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dbconnect();
const app = express();

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true,
  exposedHeaders: ["set-cookie"],
}))


// configuring routes
app.get("/",(req,res)=>{
  try{
      res.send("<h1>Hello Welcome To Tourism Platform</h1>")
  }catch(err){
    res.send('some error occurred')
    console.log(err);
  }
})
app.use("/user",userRouter);
app.use("/superadmin",superadminRouter);

// PORT
let port = process.env.PORT||5000;
app.listen(port, function() {
  console.log("<---------------Server started on PORT:"+port+"--------------->");
});
