const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new Schema({
    type:String,
    
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

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);

