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
        const categorys = await Category.find({ user_id: req.params.vendor_id })
        const categoryIds = categorys.map(category => category._id);
        products = await Product.find({ category_id: { $in: categoryIds } })
    }
    else {
        const categorys = await Category.find({ user_id: req.user.id })
        const categoryIds = categorys.map(category => category._id);
        products = await Product.find({ category_id: { $in: categoryIds } });
    }
    res.status(200).json(products);
});


const getSpecialProducts = asyncHandler(async (req, res) => {
    var products;
    if (req.params.vendor_id) {
        const user = await User.findById(req.params.vendor_id)
        if (user.role == "staticuser") {
            res.status(403)
            throw new Error("This user doesn't have Products")
        }
        const categorys = await Category.find({ user_id: req.params.vendor_id })
        const categoryIds = categorys.map(category => category._id);
        products = await Product.find({ category_id: { $in: categoryIds }, todays_special: true })
    }
    else {
        const categorys = await Category.find({ user_id: req.user.id })
        const categoryIds = categorys.map(category => category._id);
        products = await Product.find({ category_id: { $in: categoryIds }, todays_special: true })
    }
    res.status(200).json(products);
});

const getExclusiveProducts = asyncHandler(async (req, res) => {
    var products;
    if (req.params.vendor_id) {
        const user = await User.findById(req.params.vendor_id)
        if (user.role == "staticuser") {
            res.status(403)
            throw new Error("This user doesn't have Products")
        }
        const categorys = await Category.find({ user_id: req.params.vendor_id })
        const categoryIds = categorys.map(category => category._id);
        products = await Product.find({ category_id: { $in: categoryIds }, exclusive: true })
    }
    else {
        const categorys = await Category.find({ user_id: req.user.id })
        const categoryIds = categorys.map(category => category._id);
        products = await Product.find({ category_id: { $in: categoryIds }, exclusive: true })
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
    var category;
    try {
        category = await Category.findById(category_id)
        if (!category) {
            return res.status(404).json({ error: "Category not found!" });
        }

        if (category.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: "You cannot add product to other's Category" });
        }
        const product = await Product.create({
            category_id,
            name,
            price,
            is_available,
            user_id: req.user.id,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
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
    const category = await Category.findOne({ _id: product.category_id })
    if (category.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user Product");
    }

    const { product_discount } = req.body
    var newPrice;
    var updatedProduct
    if (typeof product_discount !== 'undefined') {
        if (product_discount > 0) {
            newPrice = product.price - (product_discount * product.price / 100)
            updatedProduct = await Product.findByIdAndUpdate(
                req.params.product_id,
                {
                    exclusive: true,
                    product_discount: product_discount,
                    product_newprice: newPrice
                },
                { new: true }
            )
        }
        else {
            updatedProduct = await Product.findByIdAndUpdate(
                req.params.product_id,
                {
                    exclusive: false,
                    product_discount: null,
                    product_newprice: null,
                    ...req.body
                },
                { new: true }
            );
        }
    }
    else {
        updatedProduct = await Product.findByIdAndUpdate(
            req.params.product_id,
            req.body,
            { new: true }
        )
    }

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
    const category = await Category.findOne({ _id: product.category_id })
    if (category.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete other user Product");
    }
    await Product.deleteOne({ _id: req.params.product_id });
    res.status(200).json(product);
});

module.exports = {
    getProducts,
    getSpecialProducts,
    getExclusiveProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
};


