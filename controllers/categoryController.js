const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel")
const User = require("../models/userModel")


//@desc Get all contacts
//@route GET /api/contacts
//@access private || public
const getCategorys = asyncHandler(async (req, res) => {
    var categorys;
    if (req.params.vendor_id) {
        const user = await User.findById(req.params.vendor_id)
        if(user.role == "staticuser") {
            res.status(403)
            throw new Error("This user doesn't have Category")
        }
        categorys = await Category.find({ user_id:req.params.vendor_id})
    }
    else {
        categorys = await Category.find({ user_id: req.user.id });
    }
    const data = await Promise.all(categorys.map(async (item) => {
        const products = await Product.find({ category_id: item._id })
        return {
            _id: item._id,
            user_id: item.user_id,
            name: item.name,
            is_available: item.is_available,
            products: products
        }
    }))
    res.status(200).json(data);
});


//@desc Create New contact
//@route POST /api/contacts
//@access private
const createCategory = asyncHandler(async (req, res) => {
    const { name, is_available } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const category = await Category.create({
        name,
        is_available,
        user_id: req.user.id,
    });

    res.status(201).json(category);
});


//@desc Get contact
//@route GET /api/contacts/:id
//@access public
const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.category_id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    // if (category.user_id.toString() !== req.user.id) {
    //     res.status(403);
    //     throw new Error("User don't have permission to get other user Category");
    // }

    res.status(200).json(category);
});


//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.category_id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    if (category.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user Category");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.category_id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedCategory);
});


//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.category_id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    if (category.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user Category");
    }
    await Category.deleteOne({ _id: req.params.category_id });
    res.status(200).json(category);
});

module.exports = {
    getCategorys,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};


