import express from 'express';
import { getFilteredPlaces, getPlaces } from '../controllers/placeController.js';
const router = express.Router()

router.get('/places-list', getPlaces);
router.post('/places-list', getFilteredPlaces);
export default router;
