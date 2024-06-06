const Product = require("../models/product.model");

const addProduct = async (req, res) => {

  try {

    const newProduct = new Product({
      ...req.body.productData,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};




const updateProduct = async (req, res) => {
  
  try {

    const { _id: productId , ...restProduct} = req.body;

    await Product.findByIdAndUpdate(productId, restProduct, { new: true });

    res.status(201).json(`product update successfully!`);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};


const deleteProduct = async (req, res) => {  
  try {
    const productId = req.params.id;

    const product = await Product.findOneAndDelete({ _id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};


// const getInvoices = async (req, res) => {
//   try {
//     const fromDate = req.query.fromDate ? req.query.fromDate : null;
//     const toDate = req.query.toDate ? req.query.toDate : null;
//     const username = req.query.username ? req.query.username : null;
    
//     const filter = {};
    
//     if (fromDate) {
//       filter.date = { $gte: fromDate };
//     }
    
//     if (toDate) {
//       if (!filter.date) {
//         filter.date = {};
//       }
//       filter.date.$lte = toDate;
//     }
    
//     if (username) {
//       filter.username = username;
//     }
    
//     const invoices = await Invoice.find(filter).sort({date:-1}) ;
    
//     res.status(200).json(invoices);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("internal server error!");
//   }
// };

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct
};
