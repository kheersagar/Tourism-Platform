import Place from "../mongoDB/models/places.js";
import Csv from "jquery-csv";
import extract from "extract-zip";
import uploadFile from "../utilities/firebase.js"

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Fs from "fs";

export const addPlace = async(req,res)=>{
  try{
    const {name,about,city,state,category,timing} = req.body;
    if(!(name,city,state)){
      res.status(400).send("Insufficient data");
    }else{
      const place = await Place.findOne({name,city,state});
      if(place){
        res.status(409).send("Location already added");
      }else{
        const data = await Place.create({
          name, about, city, state, category, timing
        })
        res.status(201).send(data);
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const addCSV = async(req,res)=>{
  try{
    if(req.file){
      var data = await  Fs.readFile(req.file.path,'utf8', function(err,data){
        var final = Csv.toObjects(data);
         final.forEach(function(item){
            Place.create(item);
        })
        res.status(200).send("Data upload success!");
      });
  }
} catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const getPlaces = async(req,res)=>{
  try{
    const {page,limit} = req.query;
    const places = await Place.find().skip((page-1)*limit).limit(limit);
    if(places.length<1){
      res.status(400).send("No places data found");
    }else{
      res.status(200).json({data:places});
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const editPlace = async(req,res)=>{
  try{
    const {id} = req.body;
    const{name,about,city,state,geo_locations,category,timing} = req.body;
    let place = await Place.findOne({_id:id});
    console.log(place);
    if(!place){
      res.status(404).send("Place doesn't exists for this ID...");
    }else{
      await Place.updateOne({_id:id},{$set:{name:name,about:about,city:city,state:state,geo_locations:geo_locations,category:category,timing:timing}});
      place = await Place.findOne({_id:id});
      res.status(201).send(place);
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const deletePlace= async (req,res)=>{
  try{
    const {id} = req.body;
    let place = await Place.findOne({_id:id});
    if(!place){
      res.status(404).send("Place doesn't exists for this ID...");
    }else{
      await Place.deleteOne({_id:id});
      res.status(202).send("Place deleted!");
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const getFilteredPlaces = async (req,res)=>{
  let {city,state} = req.body;
  let {page,limit} = req.query;
  // console.log( typeof city,state)
  let query = {};
  try{
  if(city?.length){
    city = JSON.parse(city) // parsing because in http request type of array was converted to string from object
    query.city = {$in : city}
  }
  if(state?.length){
    state = JSON.parse(state)
    query.state = {$in :state}
  }
    const places = await Place.find(query).skip((page-1)*limit).limit(limit);
    if(places.length<1){
      res.status(400).send("No places data found");
    }else{
      res.status(200).json({data:places});
    }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
}

export const uploadZip = async (req,res)=>{
  try{
    if(req.file){
      console.log(req.file);
      const target = path.join(__dirname,'../unzip_here/images');
      console.log(target, typeof target)
      await extract(path.join(req.file.path),{dir:target});
      console.log("Extraction complete!");
    }else{
      console.log("file not found");
    }
    let address = path.join(__dirname,'../unzip_here/images');
    Fs.readdir(address,(err,files)=>{
      if(err){
        console.log(err);
      }else{
        files.forEach(async function(file){
          console.log(file);
          await uploadFile(address+"/"+file,file);
        });
      }
    })
    res.send("Upload Success!");
  }catch(err){
    console.log(err.message);
    res.status(500).send("Internal server error!");
  }
}
