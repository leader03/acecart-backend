const express = require("express")
const router = express.Router()
const validateToken = require("../middleware/validateTokenHandler")
const authorize = require("../middleware/authorizeHandler")
const { getAllUsers, getStaticUsers, getDynamicUsers, getUserDetail } = require("../controllers/accountController")


router.get('/vendor_list', validateToken, authorize("admin"), getAllUsers)
router.get('/vendor_list/staticuser', validateToken, authorize("admin"), getStaticUsers)
router.get('/vendor_list/dynamicuser', validateToken, authorize("admin"), getDynamicUsers)
router.get('/vendor_detail/:vendor_id', validateToken, authorize("admin"), getUserDetail)


module.exports = router