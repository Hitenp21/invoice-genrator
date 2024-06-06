const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RefUser = require("../models/refUser.model");
const Product = require("../models/product.model");
const Invoice = require("../models/invoice.model");
const User = require("../models/user.model");
const mongoose = require('mongoose');


const addUser = async (req, res) => {
  try {

    const fromUser = req.userData.id;
    const user = await User.findById(fromUser);

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    // Create new user
    const newSubUser = new RefUser({
      ...req.body,
    });

    await User.findByIdAndUpdate(
      fromUser,
      { $push: { subUser: newSubUser._id } },
      { new: true }
    );

    await newSubUser.save();

    res.status(201).json({ message: "RefUser created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};

const updateUser = async(req,res) =>{
  try {
    const userId = req.params.id;
    const updates = req.body;

    const updatedUser = await RefUser.findByIdAndUpdate(userId, updates, { new: true }).populate('invoices');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updatedUser && updatedUser.invoices.length > 0) {
      await Invoice.updateMany(
        { _id: { $in: updatedUser.invoices.map(invoice => invoice._id) } },
        { $set: { username: req.body.username } },{ new: true }
      );

    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
}

const deleteRefUser = async (req, res) => {
  const id = req.params.id;
  const fromUser = req.userData.id;

  try {
    const userId = (fromUser);
    const subUserId = (id);

    const refUser = await RefUser.findById(subUserId);
    if (!refUser) {
      console.log('RefUser not found');
      return;
    }

    await refUser.deleteOne(); 

    // Remove the sub-user reference from the user document
    const adminUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { subUser: subUserId } },
      { new: true }
    );

    if (adminUser) {

          res.status(200).json({ message: 'Sub-user deleted !' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing sub-user and related data:', error);
    res.status(500).json({ message: "Server error" });
  }
};


const addProduct = async (req, res) => {
  const { productName, price, deQty, qty, fromUser } = req.body;
  try {
    const newProduct = new Product({
      productName,
      price,
      deQty,
      qty,
      fromUser,
    });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id: productId, productName, price, qty, deQty } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        productName,
        price,
        deQty,
        qty,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.body.id;

    const deletedProduct = await Product.findByIdAndDelete({ _id: productId });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addUser,
  updateUser,
  deleteRefUser,
  addProduct,
  updateProduct,
  deleteProduct,
};
