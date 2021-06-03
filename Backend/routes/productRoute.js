const express = require('express')
const upload = require('../libs/storage')
const { addProduct, getProducts, getProduct,updateProduct,deleteProduct } = require('../controllers/productController')
const api = express.Router()

//api.post('/torre',torreController.addProduct)
//api.post('/product',upload.single('image'), addProduct)
api.post('/product',upload.array('image',12), addProduct)
api.get('/products', getProducts)
api.get('/product/:id', getProduct)
api.put('/product/:id', updateProduct)
api.delete('/product/:id',deleteProduct)
module.exports = api