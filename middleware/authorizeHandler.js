const asyncHandler = require("express-async-handler");

const authorize = (role) => {
    return (req, res, next) => {
        // try {
        //     if (!req.user) {
        //         res.status(401); 
        //         throw new Error("User not authenticated");
        //     }

            if (req.user.role !== role) {
                res.status(403); 
                throw new Error("User is not authorized");
            }

            next(); 
        // } catch (error) {
        //     next(error); 
        // }
    };
};


// const authorize = (...role) => {
//     return (req,res,next) => {
//         if(!role.includes(req.user.role)) {
//             res.status(403);
//             throw new Error("User is not authorized");
//         }
//         next()
//     }
// }

module.exports = authorize