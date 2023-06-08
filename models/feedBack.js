const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedBackScheme = new Schema({
    
    name:{
        type:String,
        default:"unknown"
    },
    email:{
        type:String,
        required:true
        
    },
    message:{
        type:String,
        default:"unknown"
    }
  
})

module.exports = mongoose.model("FeedBack",feedBackScheme);
