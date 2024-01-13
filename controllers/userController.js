const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const SuperUser = require("../models/userModel")




//@desc Register a user
//@route POST /api/users/register
//@access private
const registerUser = asyncHandler( async (req,res) => {
    const {username,password,role,full_name, restaurant_name,contact_no, location} = req.body
    if(!username || !password || !role) {
        res.status(400)
        throw new Error("All fields are mandotary")
    }
    const userAvailable = await User.findOne({username})
    if(userAvailable) {
        res.status(400)
        throw new Error("User already registerd")
    }
    
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        username,
        password: hashedPassword,
        role,
        full_name,
        restaurant_name,
        contact_no,
        location
    })
    if(user) {
        res.status(201).json({_id: user.id, username: user.username, role: user.role})
    } else {
        res.status(400)
        throw new Error("User data isnot valid")
    }
    res.json({message: "User registered successfully"})
})


//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler( async (req,res) => {
    const {username,password} = req.body
    if(!username || !password) {
        res.status(400)
        throw new Error("All fields are mandotary")
    }
    const user = await User.findOne({ username });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          id: user.id,
          role: user.role
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "10000m" }
    );
    res.status(200).json({ accessToken: accessToken, role: user.role });
  } else {
    res.status(401);
    throw new Error("Username or Password is not valid");
  }
})


//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const userData = user.role === "admin" ? 
    {
      id: user._id,
      username: user.username,
      role: user.role
    }
    :
    {
      vendor_id: user._id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
      restaurant_name: user.restaurant_name,
      contact_no: user.contact_no,
      location: user.location
    }
    res.status(200).json(userData);
  });

const updateCurrentUser = asyncHandler(async (req,res) => {
  if(req.user.role === "admin") {
    res.status(404)
    throw new Error("Can't Update Admin")
  }
  // if(req.body.username, req.body.role) {
  //   res.status(403)
  //   throw new Error("Can't update this field")
  // }
  
  const allowedFields = ["full_name", "restaurant_name", "contact_no", "location"];

  // Check if any field other than allowedFields is present in the request body
  const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

  if (invalidFields.length > 0) {
    res.status(403);
    throw new Error(`Can't update fields: ${invalidFields.join(', ')}`);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      full_name: req.body.full_name,
      restaurant_name: req.body.restaurant_name,
      contact_no: req.body.contact_no,
      location: req.body.location
    },
    { new: true }
  )
  res.status(200).json(updatedUser)
})




module.exports = {registerUser, loginUser, currentUser, updateCurrentUser}