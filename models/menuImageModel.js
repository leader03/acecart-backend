const mongoose = require("mongoose")



const menuImageSchema = mongoose.Schema(
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
        }
    }
)

module.exports = mongoose.model("MenuImage", menuImageSchema)