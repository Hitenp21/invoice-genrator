const User = require('../models/user.model'); // Assuming the path to your User model file
const RefUser = require('../models/refUser.model'); // Assuming the path to your RefUser model file
const Product = require('../models/product.model'); // Assuming the path to your Product model file

const getSubUserData = async (req, res) => {
  try {
    const userId = req.userData.id; 

    const user = await User.findById(userId).populate({
      path: 'subUser',
      populate: {
        path: 'products',
        model: 'Product'
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subUsers = user.subUser?.map(subUser => ({
      username: subUser.username,
      products: subUser.products.map(product => ({
        productName: product.productName,
        price: product.price,
        deQty: product.deQty,
        qty: product.qty
      }))
    }));

    res.status(200).json({ subUsers });
  } catch (error) {
    console.error("Error fetching subUser data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const totalPrice = async (req, res) => {
  try {
    // Get the logged-in user's ID from the request object
    const userId = req.userData.id; // Assuming you have implemented user authentication middleware

    // Find the user document
    const user = await User.findById(userId).populate({
      path: 'subUser',
      populate: {
        path: 'products',
        model: 'Product'
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract subUsers and calculate total price for each subUser
    const subUsersWithTotalPrice = user.subUser.map(subUser => {
      const totalProductPrice = subUser.products.reduce((total, product) => {
        const productTotalPrice = product.price * product.deQty * product.qty;
        return total + productTotalPrice;
      }, 0);
      return {
        username: subUser.username,
        totalProductPrice
      };
    });

    // Calculate the sum of all product total prices
    const totalAllProductsPrice = subUsersWithTotalPrice.reduce((total, subUser) => {
      return total + subUser.totalProductPrice;
    }, 0);

    res.status(200).json({ subUsersWithTotalPrice, totalAllProductsPrice });
  } catch (error) {
    console.error("Error fetching subUser data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSubUserData , totalPrice };
