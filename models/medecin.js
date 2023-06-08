const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")


const medecinSchema = new Schema({
    
    
     patients:[
        {
            type:Schema.Types.ObjectId,
            ref:"Patient"
        }
     ],

     phone:{
        type:Number,
        unique:true
    
    },
  
     email:{
        type:String,
        unique:true,
        required:true
    },
    photo:{
        type:String,
        default:"/homeperson.svg"
    }
    
})

medecinSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Medecin",medecinSchema);

