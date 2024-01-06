const mongoose = require("mongoose")



const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add username"]
        },
        password: {
            type: String,
            required: [true, "Please add password"]
        },
        role: {
            type: String,
            enum: ['staticuser','dynamicuser', 'admin'],
            default: 'user'
        },
        full_name: {
            type: String
        },
        restaurant_name: {
            type: String
        },
        contact_no: {
            type: String
        },
        location: {
            type: String
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)