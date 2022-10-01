import express from 'express';

import { loginUser, registerUser, userProfile, createAdmin, userUpdate, userDelete} from '../controllers/userController.js';

import {addPlace, addCSV,uploadZip, editPlace, deletePlace} from '../controllers/placeController.js';

import tokenCheck from '../middleware/tokenCheck.js';

const router = express.Router();

// //////FILE UPLOAD///////////////
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import multer from "multer";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../assets/csv'));
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
  }
});

var upload = multer({storage:storage});
// ///////////////////////////////

// MIDDLEWARE
router.post('/login', loginUser);

router.use(tokenCheck.isSuperadmin);

// ROUTES
router.post('/register', registerUser);

router.post('/admin-create',createAdmin);

router.get('/superadmin-profile', userProfile);

router.post('/user-update',userUpdate);

router.post('/user-delete', userDelete);

router.post('/add-place', addPlace);

router.post('/edit-place', editPlace);

router.post('/delete-place', deletePlace);

router.post('/upload-zip',upload.single('zip'),uploadZip);

router.post('/add-csv',upload.single('file'),addCSV);


export default router;
