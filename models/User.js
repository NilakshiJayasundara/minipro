const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  avatar:{
    type:String,
    required:true

  },
  title:{
    type:String,
    required:true

  },
  firstName:{
    type:String,
    required:true

  },
  lastName:{
    type:String,
    required:true

  },
  userLevel:{
    type:String,
    required:true

  },

  
  id:{
    type:String,
    required:true

  },
  

});
module.exports = User = mongoose.model("users", UserSchema);