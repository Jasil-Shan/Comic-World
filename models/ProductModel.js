const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    mrp:{
        type:Number,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    stock:{
        type:Number,
        required:true
    },
    Status: {
        type:Boolean,
        required:true
        
    },
    image: {
        type: Array,
        required: true
    },
    SubImage:{
        type: Array,
        required:false
    },
    
},{
    timestamps:true
})
 
const productModel = mongoose.model('Products', productSchema)

module.exports = productModel
