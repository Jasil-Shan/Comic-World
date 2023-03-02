const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:Number,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    block:{
        type:Boolean,
        required:true
    },
    cart:{
        type:Array,
    },
    wishlist:{
        type:Array,
    },
    address:{
        type:Array,
    }
})

const userModel = mongoose.model('Users',userSchema)

module.exports= userModel
