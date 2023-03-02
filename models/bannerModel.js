const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    image:{
        type:Object,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    }
   
})

const BannerModel = mongoose.model('Banner',bannerSchema)

module.exports= BannerModel