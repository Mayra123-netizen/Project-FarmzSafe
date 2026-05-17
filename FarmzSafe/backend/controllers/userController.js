const User = require('../models/Usermodel');

// Signing up a new user
const SignUpUser = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//logging in a user

const loginUser = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({email,password});
    if (!user){
      return res.status(404).json({message: "User not found, Recheck your credentials"})
    }
    res.status(200).json({message: "User logged in Successfully"});
  } catch (error) {
    res.status(401).json({ message: "User is unauthorised" });
    res.status(500).json({message:"Server error"});
  }
};


module.exports = {loginUser, SignUpUser};

