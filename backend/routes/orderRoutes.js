import express from 'express'
const router = express.Router()
import { addOrderItems, getAllOrders, getMyOrders, getOrderById, updateOrder } from '../controllers/orderController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems).get(protect, admin, getAllOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrder)

export default router