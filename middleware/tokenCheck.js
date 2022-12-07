import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const tokenCheck = {
  isSuperadmin: function(req,res,next){
    const token = req.cookies['x-access-token'];
    if(!token ){
      return res.status(403).send("Authentication token missing!");
    }
    const decode = jwt.verify(token,process.env.TOKEN_KEY);
    req.user = decode;
    if(req.user.role!='superadmin'){
      return res.status(401).send("Invalid Token");
    }else{
      next();
    }
  },
  isAuth: function(req,res,next){
    const token = req.cookies['x-access-token'];
    if(!token){
      return res.status(403).send("Authentication token missing!");
    }
    const decode = jwt.verify(token,process.env.TOKEN_KEY);
    req.user = decode;
    if(!req.user){
      return res.status(401).send("Invalid Token");
    }else{
      next();
    }
  }
}

export default tokenCheck;
