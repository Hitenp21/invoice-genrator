const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mobileNo : { type : String, required : true},
  email : { type : String , required : true},
  address : { type : String },
  gstnum : { type:String  },
  createdAt: { type: Date, default: Date.now },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  invoices : [{ type:mongoose.Schema.Types.ObjectId , ref:'Invoice'}]
});


refUserSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const refUserId = this._id;

  // Delete related products
  await mongoose.model('Product').deleteMany({ fromUser: refUserId });

  // Delete related invoices
  await mongoose.model('Invoice').deleteMany({ user: refUserId });

  next();
});


const RefUser = mongoose.model("RefUser", refUserSchema);

module.exports = RefUser;
