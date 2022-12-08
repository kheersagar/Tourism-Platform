import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {generateRefreshToken, generateToken} from "../utilities/generateToken.js";
dotenv.config();

const tokenCheck = {
  isSuperadmin: function (req, res, next) {
    const token = req.cookies["x-access-token"];
    if (!token) {
      return res.status(403).send("Authentication token missing!");
    }
    const decode = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decode;
    if (req.user.role != "superadmin") {
      return res.status(401).send("Invalid Token");
    } else {
      next();
    }
  },
  isAuth: function (req, res, next) {
    const token = req.cookies["x-access-token"];
    const refreshToken = req.cookies["refresh-token"];
    if (!token) {
      return res.status(403).send("Authentication token missing!");
    }
    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
      if (err) {
        // checking for refresh token is valid or not
        jwt.verify(refreshToken,process.env.TOKEN_KEY,(refreshTokenErr, decodedData) => {
            if (refreshTokenErr) return res.status(403).send(err);
            console.log(decodedData)
            const token = generateToken(decodedData,decodedData.email,decodedData.role)
            const refreshToken = generateRefreshToken(decodedData,decodedData.email,decodedData.role)
            req.user = decodedData;
            res.cookie('x-access-token', token, { expires: new Date(Date.now() + 360000), httpOnly: true, sameSite: 'none', secure: true })
            res.cookie('refresh-token', refreshToken, { expires: new Date(Date.now() + 2*360000), httpOnly: true, sameSite: 'none', secure: true })
            next();
          }
        );
      }else{
        req.user = data
        next();
      }
    });
  },
};

export default tokenCheck;