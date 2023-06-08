
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    
   content:{
        type:String
    },
   
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"

     },
     to:{
        type:Schema.Types.ObjectId,
        ref:"User"
     },

     date:{
        type:Date,
        default: Date.now
    }},
     {  
        timestamps:true
     }
    
)


module.exports = mongoose.model("Message",messageSchema);