const express = require("express")
const router = express.Router()
const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const validateToken = require("../middleware/validateTokenHandler")
const authorize = require("../middleware/authorizeHandler")


router.get("/", validateToken, authorize('dynamicuser'), getProducts)
router.get("/:vendor_id", getProducts)
router.post("/", validateToken, authorize('dynamicuser'), createProduct)
router.get("/detail/:product_id", getProduct)
router.put("/detail/:product_id", validateToken, authorize('dynamicuser'), updateProduct)
router.delete("/detail/:product_id", validateToken, authorize('dynamicuser'), deleteProduct)


// router.use(validateToken)
// router.route("/").get(getProducts).post(createProduct)
// router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct)


module.exports = router