const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/invested");

const userschema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    }
  ],
  profile: {
         type:String,
        default:"profile.png"
  },
});

module.exports = mongoose.model("user", userschema);
