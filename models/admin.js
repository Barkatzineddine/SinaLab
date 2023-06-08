const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")


const adminSchema = new Schema({
    
    
     patiens:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
     ],
  
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

adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin",adminSchema);

