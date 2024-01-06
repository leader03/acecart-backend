const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const User = require("../models/userModel")
const Category = require("../models/categoryModel")



//@desc Get all contacts
//@route GET /api/contacts
//@access private || public
const getProducts = asyncHandler(async (req, res) => {
    var products;
    if (req.params.vendor_id) {
        const user = await User.findById(req.params.vendor_id)
        if (user.role == "staticuser") {
            res.status(403)
            throw new Error("This user doesn't have Products")
        }
        products = await Product.find({ user_id: req.params.vendor_id })
    }
    else {
        products = await Product.find({ user_id: req.user.id });
    }
    res.status(200).json(products);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
const createProduct = asyncHandler(async (req, res) => {
    const { category_id, name, price, is_available } = req.body;
    if (!category_id || !name || !price) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const category = await Category.findOne({ _id: category_id, user_id: req.user.id})
    console.log(category);
    if(!category) {
        res.status(404);
        throw new Error("You cannot add product to other's Category")
    }
    const product = await Product.create({
        category_id,
        name,
        price,
        is_available,
        user_id: req.user.id,
    });

    res.status(201).json(product);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access public
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // if (product.user_id.toString() !== req.user.id) {
    //     res.status(403);
    //     throw new Error("User don't have permission to get other user Product");
    // }

    res.status(200).json(product);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user Product");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.product_id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedProduct);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    if (product.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user Product");
    }
    await Product.deleteOne({ _id: req.params.product_id });
    res.status(200).json(product);
});

module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
};


