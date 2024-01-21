const express = require("express")
const router = express.Router()
const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getSpecialProducts,
    getExclusiveProducts,
} = require("../controllers/productController");
const validateToken = require("../middleware/validateTokenHandler")
const authorize = require("../middleware/authorizeHandler")


router.get("/", validateToken, authorize('dynamicuser'), getProducts)
router.get("/special_product", validateToken, authorize('dynamicuser'), getSpecialProducts)
router.get("/exclusive", validateToken, authorize('dynamicuser'), getExclusiveProducts)

router.get("/:vendor_id", getProducts)
router.get("/special_product/:vendor_id", getSpecialProducts)
router.get("/exclusive/:vendor_id", getExclusiveProducts)

router.post("/", validateToken, authorize('dynamicuser'), createProduct)
router.get("/detail/:product_id", getProduct)
router.put("/detail/:product_id", validateToken, authorize('dynamicuser'), updateProduct)
router.delete("/detail/:product_id", validateToken, authorize('dynamicuser'), deleteProduct)


// router.use(validateToken)
// router.route("/").get(getProducts).post(createProduct)
// router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct)


module.exports = router