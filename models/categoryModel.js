const mongoose = require("mongoose")



const categorySchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        name: {
            type: String,
            required: [true, "Category Name is required"]
        },
        image: {
            type: String
        },
        is_available: {
            type: Boolean,
            default: false
        }
    }
)

module.exports = mongoose.model("Category", categorySchema)