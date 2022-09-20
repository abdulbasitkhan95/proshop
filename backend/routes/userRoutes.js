import express from 'express'
const router = express.Router()
import {authUser, deleteUser, getAllUsers, getUserById, getUserProfile, registerUser, updateUserByAdmin, UpdateUserProfile} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, UpdateUserProfile)
router.route('/allusers').get(protect, admin, getAllUsers)
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUserByAdmin)

export default router