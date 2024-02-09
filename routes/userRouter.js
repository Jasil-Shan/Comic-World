const express = require('express')
const { appendFile } = require('fs')
const { getUserSignup, getUserLogin, getUserHome, postuserSignup, postuserLogin, getUserLogout, getSendOtp, postSendOTP, getSendOTP, getUserCart, getUserProduct, getUserLogOut, getLogUserHome, getAddtoCart, getUserComics, getUserCollectables, getUserDC, getUserProfile, getSearchProducts, postSearchProducts, getUserCheckout, getDeleteCart, getUserQuantityUpdate, getUserWishlist, getAddtoWishlist, getDeleteWish, getUserMoveCart, getUserFilter, getUserSort, getUserComicSort, getUserCollectablesort, postSaveAddress, getCouponRedeem, AddUserAddress, editUserAddress, editUserProfile, postEditUserAddress, postEditUserProfile, getUserOrders, postUserCheckout, getCancelOrder, getPaymentURL } = require('../controller/userController')
const router = express.Router()
const userModel = require('../models/usermodel')
const verifyUser = require('../middleware/verifyUser')
const { getAdminDeleteBanner } = require('../controller/adminController')


router.get('/', getUserHome)
// router.get('/User', getLogUserHome)
router.get('/SignUp', getUserSignup)
router.get('/Login', getUserLogin)
router.post('/signin', postuserSignup)
router.post('/Home', postuserLogin)
router.get('/logout', getUserLogout)
router.post('/SendOTP', getSendOTP)


router.get('/Product/:id', getUserProduct)
router.get('/Cart', getUserCart)
router.get('/UserLogout', getUserLogOut)
router.get('/AddCart/:id', verifyUser, getAddtoCart)
router.get('/Comic', getUserComics)
router.get('/Collectables', getUserCollectables)
router.get('/DC', getUserDC)
router.get('/UserProfile', verifyUser, getUserProfile)
router.post('/Search', postSearchProducts)
router.get('/Checkout', verifyUser, getUserCheckout)
router.get('/DeleteCart/:id', getDeleteCart)
router.get('/DeleteWish/:id', getDeleteWish)
router.get('/QuantityUpdate/:proId', verifyUser, getUserQuantityUpdate)
router.get('/WIshlist', verifyUser, getUserWishlist)
router.get('/AddWishlist/:id', verifyUser, getAddtoWishlist)
router.get('/MoveCart/:id', verifyUser, getUserMoveCart)
router.get('/Filter', getUserFilter)
router.get('/Comics', getUserComicSort)
router.get('/Collectable', getUserCollectablesort)
router.post('/checkout', verifyUser, postUserCheckout)
router.post('/AddUserAddress', AddUserAddress)
router.post('/editUserAddress', verifyUser, postEditUserAddress)
router.post('/editUserProfile', verifyUser, postEditUserProfile)
router.get('/userOrders', verifyUser, getUserOrders)
router.get('/cancelOrder/:id', getCancelOrder)
router.get('/return', getPaymentURL)



module.exports = router

