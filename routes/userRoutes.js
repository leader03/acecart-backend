const express = require("express")
const {registerUser, loginUser, currentUser, updateCurrentUser, changePassword} = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")
const authorize = require("../middleware/authorizeHandler")

const router = express.Router()

router.post("/register", validateToken, authorize('admin'),  registerUser)
router.post("/login", loginUser)
router.get("/current", validateToken, currentUser)
router.put("/current", validateToken, updateCurrentUser)
router.put("/change_password", validateToken, changePassword)


module.exports = router