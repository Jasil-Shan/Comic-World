const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    orderStatus: {
        type: String,
        default: "Pending"
    },
    paid: {
        type: Boolean,
        required: true,
        default: false
    },
    orderId:{
        type:String,
        required:true
    },   
    
    address: {
        type: Object,
        required: true
    },
    product: {
        type: Object,
        required: true
    },
    orderDate:{
        type:String,
        required:true
    },
    userId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    dispatch: {
        type: Date,
        default: new Date(new Date().setDate(new Date().getDate() + 7))
    },
    payment: {
        type: String,
    },
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true })


const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel