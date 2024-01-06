const express = require("express")
const router = express.Router()
const {
    getCategorys,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");
const validateToken = require("../middleware/validateTokenHandler")
const authorize = require("../middleware/authorizeHandler")


router.get("/", validateToken, authorize('dynamicuser'), getCategorys)
router.get("/:vendor_id", getCategorys)
router.post("/", validateToken, authorize('dynamicuser'), createCategory)
router.get("/detail/:category_id", getCategory)
router.put("/detail/:category_id", validateToken, authorize('dynamicuser'),  updateCategory)
router.delete("/detail/:category_id", validateToken, authorize('dynamicuser'),  deleteCategory)

// router.use(validateToken)
// router.route("/").get(getCategorys).post(createCategory)
// router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory)


module.exports = router