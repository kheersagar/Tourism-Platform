import express from 'express'
const app = express();
import jwt from 'jsonwebtoken'

export function generateToken(obj,email,role){
  return jwt.sign(
  {obj_id: obj._id, email,role },
  process.env.TOKEN_KEY,
  {expiresIn:'15s'},
);
}

export const generateRefreshToken = (obj,email,role) =>{
  return jwt.sign(
    {obj_id: obj._id, email,role },
    process.env.TOKEN_KEY,
    {expiresIn:'1d'},
  );
}
