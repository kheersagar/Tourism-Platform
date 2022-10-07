import express from 'express';
const router = express.Router();
import {getPlaces, getFilteredPlaces} from "../controllers/placeController.js";

import tokenCheck from '../middleware/tokenCheck.js';

router.get("/", async(req,res)=>{
});

router.post('/places-list', getFilteredPlaces);
router.use(tokenCheck.isAuth);

router.get('/places-list', getPlaces);


export default router;
