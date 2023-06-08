const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recrutementScheme = new Schema({
    
    name:{
        type:String,
        default:"unknown"
    },
    cv:{
        type:String,
        required:true
        
    },
    profession:{
        type:String,
        default:"unknown"
    },
    ldm:{
        type:String,
        required:true
        
    }
    
})

module.exports = mongoose.model("Recrutement",recrutementScheme);
