const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body.formData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body.formData;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRefUserDAta = async (req, res) => {
  const userId = req.userData.id;
  try {
    const user = await User.findById(userId).populate({
      path: "subUser",
      select: "-password",
      populate: {
        path: "products",
        model: "Product",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { username, email } = req.body.formData;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: username, email: email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal server error");
  }
};


const getUser = async(req,res)=>{
  const userId=req.userData.id;
  try {
    const user = await User.findById(userId).select('username email')

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
}

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};

module.exports = {
  login,
  logout,
  signup,
  updateUser,
  getUser,
  getAllRefUserDAta,
};
