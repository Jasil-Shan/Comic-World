const express = require('express')
const { getAdminlogin, postAdminLogin, getAdminUser, getAdmindash, getAdminproduct, getAdmincategory, getAdminUserBlock, getadminlogout, getAdminuserUnblock, postadminSearch, getAdminAddCat, postAdminAddCat, getAdminCatDelete, getAdminAddProduct, postAdminAddProduct, getAdminDeleteProduct, getAdminEditProduct, putAdminEditProduct, postProductUpdate, getEditCategory, postEditCategory, getAdminProductList, getAdminProductUnlist, postAdminSearchProduct, getAdminBanner, getAdminAddBanner, postAdminSaveBanner, getAdminDeleteBanner, getAdminCoupon, getAdminAddCoupon, postAdminAddCoupon, getDeleteCoupon, getCouponRedeem, getAdminOrder, getAdminOrderManage } = require('../controller/adminController')
const multiUpload = require('../middleware/multer')
const arouter = express.Router()
const CategoryModel = require('../models/categoryModel')
const ProductModel = require('../models/ProductModel')
const BannerModel = require('../models/bannerModel')
const verifyAdmin = require('../middleware/verifyAdmin')




arouter.get('/',getAdminlogin)
arouter.post('/login', postAdminLogin)
arouter.get('/user',verifyAdmin,getAdminUser)
arouter.get('/dash',verifyAdmin,getAdmindash)
arouter.get('/products',verifyAdmin,getAdminproduct)
arouter.get('/category',verifyAdmin,getAdmincategory)
arouter.get('/block/:id',verifyAdmin,getAdminUserBlock)
arouter.get('/Adminlogout',verifyAdmin,getadminlogout)
arouter.get('/unblock/:id',verifyAdmin,getAdminuserUnblock)
arouter.post('/search-user',verifyAdmin,postadminSearch)
arouter.get('/addCat',verifyAdmin,getAdminAddCat)
arouter.post('/New-Cat',postAdminAddCat)
arouter.get('/DeleteCat/:id',getAdminCatDelete)
arouter.get('/AddProduct',verifyAdmin,getAdminAddProduct)
arouter.post('/SaveProduct',multiUpload,postAdminAddProduct)
arouter.get('/DeleteProduct/:id',getAdminDeleteProduct)
arouter.get('/EditProduct/:id',verifyAdmin,putAdminEditProduct)
arouter.post('/SaveProductUpdate',multiUpload,postProductUpdate) 
arouter.get('/EditCategory/:id',verifyAdmin,getEditCategory)
arouter.post('/EditCategory',postEditCategory)
arouter.get("/ListProduct/:id",verifyAdmin,getAdminProductList)
arouter.get("/UnlistProduct/:id",getAdminProductUnlist)
arouter.post("/SearchProduct",postAdminSearchProduct)
arouter.get("/banner",verifyAdmin,getAdminBanner)
arouter.get("/AddBanner",getAdminAddBanner)
arouter.post("/SaveBanner",multiUpload,postAdminSaveBanner)
arouter.get("/DeleteBanner/:id",getAdminDeleteBanner)
arouter.get("/coupon",verifyAdmin,getAdminCoupon)
arouter.get("/order",verifyAdmin,getAdminOrderManage)
arouter.get("/AddCoupon",verifyAdmin,getAdminAddCoupon)
arouter.post("/SaveCoupon",verifyAdmin,postAdminAddCoupon)
arouter.get("/DeleteCoupon/:id",verifyAdmin,getDeleteCoupon)



 
module.exports = arouter