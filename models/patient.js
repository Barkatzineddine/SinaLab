const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")


const patientSchema = new Schema({
    
    
     results:[{
        type:Schema.Types.ObjectId,
        ref:"Result"

     }],
     email:{
        type:String,
        unique:true,
        required:true
    },
    medecins:[{
        type:Schema.Types.ObjectId,
        ref:"Medecin"
    }],

    phone:{
        type:Number,
        unique:true
    
    },
    photo:{
        type:String,
        default:"/homeperson.svg"
    }
    
})

patientSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Patient",patientSchema);

