const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationScheme = new Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
       
        
    },
    phone:{
        type:Number,
        required:true
    },
    adresse:{
        type:String,
        required:true
        
    }
    
})

module.exports = mongoose.model("Reservation",reservationScheme);
