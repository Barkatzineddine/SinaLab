const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultScheme = new Schema({
    
    name:String,
    path:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
    },
    
    date:{
        type:Date,
        default: Date.now
    }},
     {  
        timestamps:true
     }
    
)


module.exports = mongoose.model("Result",resultScheme);

