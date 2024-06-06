const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price : { type : Number , required: true , default : 0},
  dQty: { type : Number , required:true , default : 1},
  qty: { type : Number , required:true , default : 1},
  fromUser : { type: Schema.Types.ObjectId, ref: 'RefUser' },
  createdAt: { type: Date, default: Date.now }
});

productSchema.post('save', async function(product) {
    try {
        await mongoose.model('RefUser').findByIdAndUpdate(product.fromUser, { $push: { products: product._id } }, { new: true });
        console.log(`Added  products field`);
    } catch (error) {
        console.error(`Error updating RefUser's products field: ${error}`);
    }
});


productSchema.pre('findOneAndDelete', async function(next) {
    try {
      const productId = this.getQuery()['_id'];
  
      await mongoose.model('RefUser').updateMany(
        { products: productId },
        { $pull: { products: productId } }
      );
  
      next();
    } catch (err) {
      next(err);
    }
  });


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
