const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")



const getAllUsers = asyncHandler( async (req,res) => {
    const users = await User.find({role: {$ne: "admin"}})
    const userData = users.map(user => {
        return {
            username: user.username,
            role: user.role,
            full_name: user.full_name || "",
            restaurant_name: user.restaurant_name || "",
            contact_no: user.contact_no || "",
            location: user.location || ""
        }
    })
    res.status(200).json(userData)
})

const getStaticUsers = asyncHandler( async (req,res) => {
    const users = await User.find({role: {$eq: "staticuser"}})
    res.status(200).json(users)
})

const getDynamicUsers = asyncHandler( async (req,res) => {
    const users = await User.find({role: {$eq: "dynamicuser"}})
    res.status(200).json(users)
})

const getUserDetail = asyncHandler( async (req,res) => {
    const users = await User.findById(req.params.vendor_id)
    res.status(200).json(users)
})

module.exports = {getAllUsers,getStaticUsers, getDynamicUsers, getUserDetail}