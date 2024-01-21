const mongoose = require("mongoose")

const productSchema = mongoose.Schema(
    {
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Category"
        },
        name: {
            type: String,
            required: [true, "Please add product name"]
        },
        price: {
            type: Number,
            required: [true, "Please add product price"]
        },
        is_available: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        },
        todays_special: {
            type: Boolean,
            default: false
        },
        exclusive: {
            type: Boolean,
            default: false
        },
        product_discount: {
            type: Number,
            default: null
        },
        product_newprice: {
            type: Number,
            default: null
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Product", productSchema)   