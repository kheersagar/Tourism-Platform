import Place from "../mongoDB/models/places.js";
import Csv from "jquery-csv";
import paginatedResult from "../utilities/paginate.js";
import extract from "extract-zip";

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

    const places = await Place.find();
    // const places = await Place.find();
    if(places.length<1){
      res.status(400).send("No places data found");
    }else{
      const pagedata = paginatedResult(places,req.query.page,req.query.limit);
      res.status(200).json({data:pagedata});
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const editPlace = async(req,res)=>{
  try{
    const {name} = req.body;
    const{about,city,state,geo_locations,category,timing} = req.body;
    let place = await Place.findOne({name});
    if(!place){
      res.status(404).send("Place doesn't exists.");
    }else{
      await Place.updateOne({name},{$set:{about:about,city:city,state:state,geo_locations:geo_locations,category:category,timing:timing}});
      place = await Place.findOne({name});
      res.status(201).send(place);
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const deletePlace= async (req,res)=>{
  try{
    const {name} = req.body;
    let place = await Place.findOne({name});
    if(!place){
      res.status(404).send("Place doesn't exists.");
    }else{
      await Place.deleteOne({name});
      res.status(202).send("Place deleted!");
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error!");
  }
}

export const getFilteredPlaces = async (req,res)=>{
  let {city,state} = req.body;
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
    const places = await Place.find(query)
      .skip(1).limit(5);
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
      const target = path.join(__dirname,'../unzip_here');
      console.log(target, typeof target)
      await extract(path.join(req.file.path),{dir:target});
      console.log("Extraction complete");
      res.send("sucessfull")
    }else{
      console.log("file not found");
    }
  }catch(err){
    console.log(err.message);
    res.status(500).send("Internal server error!");
  }
}