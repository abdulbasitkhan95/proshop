import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

const addOrderItems = asyncHandler(async (req, res) => {
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        taxPrice, 
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered
    } = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
        return
    }
    else {
        const order = new Order({ 
            orderItems, 
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            taxPrice, 
            shippingPrice,
            totalPrice,
            isPaid,
            paidAt,
            isDelivered
        })

        const createOrder = await order.save()
        
        res.status(201).json(createOrder)
    }

})

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order) {
        res.json(order)
    }
    else {
        res.status(404)
    }
})

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.json(orders)

})

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)

})

const updateOrder = asyncHandler(async (req, res) => {
    const {isDelivered} =  req.body

    const order = await Order.findById(req.params.id)

    if(order) {
        order.isDelivered = isDelivered
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.json(404)
        throw new Error('Product not found')
    }
})

export { addOrderItems, getOrderById, getMyOrders, getAllOrders, updateOrder }