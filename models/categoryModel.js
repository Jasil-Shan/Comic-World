const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    Category:{
        type:String,
        required:true
    },
    Sub:{
        type:Array,
        required:true
    }
   
})

const CategoryModel = mongoose.model('Category',categorySchema)

module.exports= CategoryModel
