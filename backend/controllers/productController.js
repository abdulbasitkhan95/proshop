import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products =  await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page -1))

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if(product) {
        res.json(product)
    }
    else {
        res.status(404)
        throw new Error('Product not Found')
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if(product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    }
    else {
        res.status(404)
        throw new Error('Product not Found')
    }
})

const createProduct = asyncHandler(async (req, res) => {
    const {user, name, price, description, image, brand, category, counterInStock} =  req.body
    
    const product = await Product.create({
        user: req.user._id,
        name,
        category,
        price,
        image,
        brand,
        counterInStock,
        description
    })

    if(product) {
        res.status(201).json({
            user: product.user,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            brand: product.brand,
            counterInStock: product.counterInStock,
            description: product.description
        })
    }
    else {
        res.status(400)
        throw new Error('User not found')
    }
})


const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, counterInStock} =  req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.counterInStock = counterInStock
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.json(404)
        throw new Error('Product not found')
    }
})

const addProductReview = asyncHandler(async (req, res) => {
    const {rating, comment} =  req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if(alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = (product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length)
        await product.save()
        res.status(201).json({message: 'Review added'})

    } else {
        res.json(404)
        throw new Error('Product not found')
    }
})

const getTopProducts = asyncHandler(async (req, res) => {
    const products =  await Product.find({ }).sort({rating: -1}).limit(3)
    res.json(products)
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, addProductReview, getTopProducts } 