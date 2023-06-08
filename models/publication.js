const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publiScheme = new Schema({
    
    title:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:'localhost:8000\\default.jpg'
    },
    path:{
        type:String,
        default:'C:\\Users\\barka\\OneDrive\\Bureau\\projet-test2\\publications\\default.jpg'
    },
    content:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    }
    
})


module.exports = mongoose.model("Publication",publiScheme);

