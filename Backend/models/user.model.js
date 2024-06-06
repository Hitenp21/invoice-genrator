const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNo:{
    type:String
  },
  gstNum:{
    type:String

  },
  address:{
    type:String
  },
  createdAt: { type: Date, default: Date.now },
  subUser : [{type: mongoose.Schema.Types.ObjectId, ref: 'RefUser'}],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
