const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name:{type:String,required:true},
  about:{type:String},
  city:{type:String},
  state:{type:String},
  geo_locaions:{},
  category:{type:String,enum:['free','paid'],default:'free'},
  timing:{type:String, default:'10:00AM - 7:00PM'},
})

locationSchema.set('timestamp','true');
module.exports = mongoose.model('location',locationSchema);
