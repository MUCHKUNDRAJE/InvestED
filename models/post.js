const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/invested");

const postschema = mongoose.Schema({

    post:String,
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
    },
    title :String,
    discription:String, 
    createat:
    {
        type:Date,
        default:Date.now,
        
    }
});

module.exports = mongoose.model("post", postschema);
