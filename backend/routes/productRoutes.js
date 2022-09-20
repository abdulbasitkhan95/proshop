import express from 'express'
const router = express.Router()
import {getProducts, getProductById, deleteProduct, updateProduct, createProduct, addProductReview, getTopProducts} from '../controllers/productController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/top').get(getTopProducts)
router.route('/:id').get(getProductById)
router.route('/:id').delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)
router.route('/:id/reviews').post(protect, addProductReview)

export default router