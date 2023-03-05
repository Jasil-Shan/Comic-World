const { sendOTP } = require('../helper/SendOTP');
const doValidate = require('../helper/Validate');
const userModel = require('../models/usermodel')
const session = require('express-session');
const productModel = require('../models/ProductModel');
const BannerModel = require('../models/bannerModel');
const { totalmem } = require('os');
const couponModel = require('../models/couponModel');
const orderModel = require('../models/OrderModel');
const { format } = require('path/win32');
const uniqid = require('uniqid')
const uid = uniqid()
const axios = require('axios')
const createId = require('../middleware/createId')


let OTP = Math.floor(Math.random() * 1000000);
let CheckOTP
let UserDetails

var userController = {

    getUserLogin: (req, res) => {
        res.render('login')
    },

    getUserHome: async (req, res) => {
        try {
            // _id = req.session.user.id
            const Banner = await BannerModel.find({}).lean()
            // let count = await userModel.findOne({_id},{cart:1}).count()
            if (req.session.user) {
                const Log = req.session.user
                res.render('Home', { Log, Banner })
            }
            else {
                res.render('Home', { Banner })
            }
        } catch (err) {
            console.log(err);
            res.render('404 page')
        }
    },
    getUserComics: async (req, res) => {
        try {
            let cat = req.query.cat
            if (cat) {
                const Comics = await productModel.find({ subCategory: cat }).lean()
                res.render('Comics', { Comics })
            }
            const Comics = await productModel.find({ category: 'Comic' }).lean()
            if (req.session.user) {
                const Log = req.session.user
                res.render('Comics', { Comics, Log })
            }
            else {
                res.render('Comics', { Comics })
            }
        } catch (err) {
            console.log(err);

        }


    },
    getUserCollectables: async (req, res) => {
        try {
            const Collectables = await productModel.find({ category: 'Collectables' }).lean()
            if (req.session.user) {
                const Log = req.session.user
                res.render('Collectables', { Collectables, Log })
            }
            else {
                res.render('Collectables', { Collectables })
            }
        } catch (err) {
            console.log(err);
        }


    },
    getUserDC: async (req, res) => {
        try {
            const DC = await productModel.find({ subCategory: 'DC' }).lean()
            if (req.session.user) {
                const Log = req.session.user
                res.render('DC', { DC, Log })
            }
            else {
                res.render('DC', { DC })
            }
        } catch (err) {
            console.log(err);
        }

    },
    getUserProfile: async (req, res) => {
        try {
            const Log = req.session.user
            id = req.session.user.id
            const profile = await userModel.findById(id)
            const address = profile.address
            console.log(address);
            res.render('UserProfile', { profile, Log, address })
        } catch (err) {
            console.log(err);
        }
    },
    getLogUserHome: async (req, res) => {
        try {
            const Log = req.session.user
            console.log(Log);
            const products = await productModel.find({}).lean()
            res.render('UserHome', { products, Log })
        } catch (err) {
            console.log(err);
        }
    },

    getUserSignup: (req, res) => {
        res.render("SignUp")
    },

    getSendOTP: async (req, res) => {
        try {
            const { password, Cpassword } = req.body
            //validation
            const user = await userModel.findOne({ email: req.body.email })
            if (user) {
                console.log('user exists');
                return res.render('SignUp', { Duplicate: true })
            }
            if (Cpassword == password) {

                UserDetails = req.body
                res.render('SendOtp')
                console.log(UserDetails)
                sendOTP(req.body.email, OTP)
                console.log(OTP)
                CheckOTP = OTP

            }
            else {
                res.render('SignUp', { mismatch: true })
            }
        } catch (err) {
            console.log(err);
        }
    },

    postuserSignup: (req, res) => {

        if (CheckOTP == req.body.otp) {
            let block = false;
            let user = new userModel({ ...UserDetails, block })
            user.save((err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('login', { registered: true })
                }
            })
        }
        else {
            console.log("Otp error")
        }
    },

    postuserLogin: async (req, res) => {

        try {
            const { email, password } = req.body
            let user = await userModel.findOne({ email })

            if (user) {
                if (user.block == false) {
                    if (email == user.email && password == user.password) {

                        req.session.user = {
                            name: user.name,
                            id: user._id
                        }
                        res.redirect('/')
                    }
                    else {
                        res.render('login', { error: true })
                    }
                }
                else {
                    res.render('login', { ban: true })
                }
            }
            else {
                res.render('login', { error: true })
            }
        } catch (err) {
            console.log(err);
        }

    },
    getUserLogout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    },

    getUserCart: async (req, res) => {
        try {
            const Log = req.session.user
            if (req.session.user) {
                const _id = req.session.user.id
                const { cart } = await userModel.findOne({ _id }, { cart: 1 })
                if (cart.length == 0) {
                    res.render('emptyCart', { Log })
                }
                else {
                    let cartQuantity = {}
                    const cartID = cart.map(item => {
                        cartQuantity[item._id] = item.quantity
                        return item._id
                    })
                    let cartData = await productModel.find({ _id: { $in: cartID } }).lean()
                    let products = cartData.map((item, index) => {
                        return { ...item, quantity: cartQuantity[item._id] }
                    })
                    let TotalAmount = 0
                    let MRP = 0
                    let Discount
                    products.forEach((item, index) => {
                        MRP = (MRP + item.mrp)
                        TotalAmount = (TotalAmount + (item.price * item.quantity))
                        Discount = (MRP - TotalAmount)
                    })
                    res.render('UserCart', { products, TotalAmount, MRP, Discount, Log })
                }
            }
            else {
                res.render('ErrorCart')
            }
        } catch (err) {
            console.log(err);
        }
    },
    getUserProduct: async (req, res) => {
        try {
            const _id = req.params.id
            const Log = req.session.user
            const product = await productModel.findOne({
                _id
            }).lean()
            const Relation = product.subCategory
            const RelatedProducts = await productModel.find({ subCategory: Relation })
            res.render('UserProduct', { product, Log, RelatedProducts })
        } catch (error) {
            console.log(error);
        }
    },
    getUserLogOut: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    },
    postSearchProducts: async (req, res) => {
        try {
            const { key } = req.body;
            let Cat = req.query.key
            if (Cat == 'Collectable') {
                const Collectables = await productModel.find({ name: new RegExp(key, "i") }).lean();
                res.render('Collectables', { Collectables, key, message: 'Search results for' });
            }
            else {
                const Comics = await productModel.find({ name: new RegExp(key, "i") }).lean();
                res.render('Comics', { Comics, key, message: 'Search results for' });
            }
        } catch (err) {
            console.log(err);
        }
    },
    getUserCheckout: async (req, res) => {
        try {
            _id = req.session.user.id
            const aid = req.query._id
            let Eaddress
            if (aid) {
                const { address } = await userModel.findOne({ _id }, { address: 1 })
                Eaddress = address.find(e => e.id == aid)
            }
            const { cart } = await userModel.findOne({ _id }, { cart: 1 })
            const cartID = cart.map(item => {
                return item._id
            })
            const cartQuantity = cart.map(item => {
                return item.quantity
            })
            let products = await productModel.find({ _id: { $in: cartID } }).lean()
            const Log = req.session.user
            const proPrice = products.map((item, index) => {
                return (item.price * cartQuantity[index])
            })

            products.forEach((item, index) => {
                products[index].totalPrice = proPrice[index]
            })

            let TotalAmount = 0
            products.forEach((item, index) => {
                TotalAmount = (TotalAmount + (item.price * cart[index].quantity))
            })
            req.session.user.TotalAmount = TotalAmount
            const { address } = await userModel.findOne({ _id }, { address: 1 })
            //CouponRedeem
            const code = req.query.Coupon
            if (code) {
                let coupon = await couponModel.findOne({ code: code })
                if (coupon) {
                    let expiry = coupon.expiry
                    // if (expiry > new Date){
                    var Code = coupon.code
                    var Discount = coupon.cashback
                    let Total = req.session.user.TotalAmount
                    req.session.user.TotalAmount = Total - Discount
                    var Result = req.session.user.TotalAmount
                    // }
                }
                else {
                    var Invalid = true
                }
            }
            res.render('Checkout', { products, TotalAmount, Log, address, Result, Discount, Code, Invalid, proPrice, Eaddress })
        } catch (err) {
            console.log(err);
        }

    },
    getDeleteCart: async (req, res) => {
        try {
            if (req.session.user) {
                proId = req.params.id
                _id = req.session.user.id
                await userModel.updateOne({ _id }, { $pull: { cart: { _id: proId } } }, { multi: true }).then(() => {
                    console.log('deleted succesfully')
                    res.redirect('/Cart')
                }).catch(err => {
                    res.json(err)
                    console.log(err)
                })
            } else {
                res.render('ErrorCart')
            }
        } catch (err) {
            console.log(err);
        }
    },
    getAddtoCart: async (req, res) => {

        try {
            console.log('ha');
            const _id = req.session.user.id

            const productId = req.params.id
            console.log(productId);

            await userModel.updateOne({ _id }, { $addToSet: { cart: { _id: productId, quantity: 1 } } })

            res.redirect('back')
        } catch (err) {
            console.log(err);
        }

    },

    getUserQuantityUpdate: async (req, res) => {
        try {
            let _id = req.session.user.id
            let Action =req.query.Add
            console.log(Action);
            if (Action=="plus") {
                await userModel.updateOne({ _id: _id, cart: { $elemMatch: { _id: req.params.proId } } }, { $inc: { 'cart.$.quantity': 1 } })
                res.json({ plus: true })
            } else {
                let cartProduct = await userModel.findOne({ _id: _id, cart: { $elemMatch: { _id: req.params.proId } } })
                if (cartProduct.cart[0].quantity<=1) {
                    await userModel.updateOne({ _id, cart: { $elemMatch: { _id: req.params.proId } } }, { $pull: { cart: { _id: req.params.proId } } })
                    console.log('njjvjjjcj');
                } else {
                    await userModel.updateOne({ _id: _id, cart: { $elemMatch: { _id: req.params.proId } } }, { $inc: { 'cart.$.quantity': -1 } })
                }
                res.json({ minus: true })
                
            }
        } catch (err) {
            console.log(err);
        }
    },
    getUserWishlist: async (req, res) => {
        try {
            _id = req.session.user.id
            const { wishlist } = await userModel.findOne({ _id }, { wishlist: 1 })
            console.log(wishlist);
            const wishItems = wishlist.map((item) => {
                return item
            })
            const Log = req.session.user
            const products = await productModel.find({ _id: { $in: wishItems } }).lean()
            res.render('UserWishlist', { products, Log })
        } catch (err) {
            console.log(err);
        }
    },
    getAddtoWishlist: async (req, res) => {

        try {
            const _id = req.session.user.id
            const proId = req.params.id
            await userModel.updateOne({ _id }, { $addToSet: { wishlist: { _id: proId } } })
            console.log('success');
            res.redirect('back')
        } catch (err) {
            console.log(err);
        }
    },
    getDeleteWish: async (req, res) => {
        try {
            if (req.session.user) {
                proId = req.params.id
                _id = req.session.user.id
                await userModel.updateOne({ _id }, { $pull: { wishlist: { _id: proId } } }, { multi: true }).then(() => {
                    console.log('deleted succesfully')
                    res.redirect('/Wishlist')
                }).catch(err => {
                    res.json(err)
                    console.log(err)
                })
            } else {
                res.render('ErrorCart')
            }
        } catch (err) {
            console.log(err);
        }
    },
    getUserMoveCart: async (req, res) => {

        try {
            _id = req.session.user.id
            proId = req.params.id
            await userModel.updateOne({ _id }, { $addToSet: { cart: { _id: proId, quantity: 1 } } })
            await userModel.updateOne({ _id }, { $pull: { wishlist: { _id: proId } } }, { multi: true })
            res.redirect('back')
        } catch (err) {
            console.log(err);
        }
    },
    getUserFilter: async (req, res) => {
        try {
            cat = req.query.Category
            let Comics = await productModel.find({ subCategory: cat }).lean()
            let Collectables = Comics
            if (cat == 'T-shirts' || cat == 'Statues') {
                res.render('Collectables', { Collectables })

            }
            else {
                res.render('Comics', { Comics })
            }
        } catch (err) {
            console.log(err);
        }
    },
    getUserComicSort: async (req, res) => {

        try {
            Sort = req.query.sort
            if (Sort == 'A-Z') {
                let Comics = await productModel.find({ category: 'Comic' }).lean().sort({ name: 1 })
                res.render('Comics', { Comics })
            }
            else if (Sort == 'Low') {
                let Comics = await productModel.find({ category: 'Comic' }).lean().sort({ price: 1 })
                res.render('Comics', { Comics })
            }
            else if (Sort == 'High') {
                let Comics = await productModel.find({ category: 'Comic' }).lean().sort({ price: -1 })
                res.render('Comics', { Comics })
            }
        } catch (err) {
            console.log(err);
        }

    },
    getUserCollectablesort: async (req, res) => {

        try {
            Sort = req.query.sort
            if (Sort == 'A-Z') {
                let Collectables = await productModel.find({ category: 'Collectables' }).lean().sort({ name: 1 })
                res.render('Collectables', { Collectables })
            }
            else if (Sort == 'Low') {
                let Collectables = await productModel.find({ category: 'Collectables' }).lean().sort({ price: 1 })
                res.render('Collectables', { Collectables })
            }
            else if (Sort == 'High') {
                let Collectables = await productModel.find({ category: 'Collectables' }).lean().sort({ price: -1 })
                res.render('Collectables', { Collectables })
            }
        } catch (err) {
            console.log(err);
        }

    },
    postUserCheckout: async (req, res) => {
        try {
            let _id = req.session.user.id
            const address = req.body
            req.session.user.tempAddress = address
            const { cart } = await userModel.findOne({ _id }, { cart: 1 })
            const cartID = cart.map(item => {
                return item._id
            })
            const product = await productModel.find({ _id: { $in: cartID } }).lean();
            let orders = []
            let i = 0
            let orderid = createId()
            for (let item of product) {
                orders.push({
                    orderId: orderid,
                    address: address,
                    product: item,
                    orderDate: new Date().toLocaleString(),
                    userId: _id,
                    quantity: cart[i].quantity,
                    total: cart[i].quantity * item.price,
                    payment: req.body.paymentMethod
                })
                await productModel.updateOne({ _id: item._id }, { $inc: { stock: -1 * cart[i].quantity } });
                i++;
            }
            req.session.user.orders = orders
            req.session.user.orderId = orderid
            let paymentMode = req.body.paymentMethod
            if (paymentMode != 'COD') {
                let total = req.session.user.TotalAmount
                let orderId = "order_" + orderid;
                const options = {
                    method: "POST",
                    url: "https://sandbox.cashfree.com/pg/orders",
                    headers: {
                        accept: "application/json",
                        "x-api-version": "2022-09-01",
                        "x-client-id": '33168045e548176a9070ae7415086133',
                        "x-client-secret": 'bd51dbf947a404db202834c39ba10cb6f38cbdf9',
                        "content-type": "application/json",
                    },
                    data: {
                        order_id: orderId,
                        order_amount: total,
                        order_currency: "INR",
                        customer_details: {
                            customer_id: _id,
                            customer_email: 'ameenameen772@gmail.com',
                            customer_phone: '9946953906',
                        },
                        order_meta: {
                            return_url: "http://localhost:2000/return?order_id={order_id}",
                        },
                    },
                };

                await axios
                    .request(options)
                    .then(function (response) {

                        return res.render("paymentTemp", {
                            orderId,
                            sessionId: response.data.payment_session_id,
                        });
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            } else {
                await orderModel.create(orders)
                const Log = req.session.user
                if (req.body.status) {
                    await userModel.updateOne({ _id }, { $addToSet: { address: address } })
                    await userModel.findByIdAndUpdate({ _id }, { $set: { cart: [] } })
                    res.render('orderSuccess', { Log })
                }
                else {
                    // const Pro = await orderModel.find({orderId:orderid},{product:{_id},quantity:1})
                    // console.log("kjkhjk",Pro);
                    // Pro.forEach((item,index)=>{
                    //     let proid = item[index]
                    //     let quantity = item[index]
                    //     console.log(proid);
                    //     // productModel.updateOne({proid},{$set:{stock:-quantity}})
                    // })

                    await userModel.findByIdAndUpdate({ _id }, { $set: { cart: [] } })
                    res.render('orderSuccess', { Log })
                }
            }
            //Payment
        } catch (error) {
            console.log(error);
        }
    },
    AddUserAddress: async (req, res) => {

        try {
            _id = req.session.user.id
            const form = req.body
            form.id = uid
            await userModel.updateOne({ _id }, { $addToSet: { address: form } })
            res.redirect('back')
        } catch (err) {
            console.log(err);
        }

    },
    postEditUserAddress: async (req, res) => {
        try {
            const userId = req.session.user.id;
            const { name, email, address, landmark, country, state, pincode, id } = req.body;
            const result = await userModel.updateOne(
                { _id: userId, "address.id": id },
                {
                    $set: {
                        "address.$.name": name,
                        "address.$.email": email,
                        "address.$.address": address,
                        "address.$.landmark": landmark,
                        "address.$.country": country,
                        "address.$.state": state,
                        "address.$.pincode": pincode
                    }
                }
            );
            res.redirect('/UserProfile')
        } catch (err) {
            console.log(err);
        }
    },
    postEditUserProfile: async (req, res) => {

        try {
            _id = req.session.user.id
            const { name, email, mobile } = req.body
            await userModel.findByIdAndUpdate({ _id }, { $set: { name, email, mobile } })
            res.redirect('back')
        } catch (err) {
            console.log(err);
        }

    },
    getUserOrders: async (req, res) => {
        _id = req.session.user.id
        const Log = req.session.user
        try {
            let Orders = await orderModel.find({ userId: _id }).lean()
            res.render('userOrders', { Orders, Log })
        } catch (error) {
            console.log(error);
        }
    },
    getCancelOrder: async (req, res) => {
        try {
            const _id = req.params.id
            const status = req.query.status
            await orderModel.updateOne({ _id }, { orderStatus: status })
            res.redirect("back")

        } catch (error) {
            console.log(error);
        }
    },
    getPaymentURL: async (req, res) => {
        try {
            const order_id = req.query.order_id;
            const options = {
                method: "GET",
                url: "https://sandbox.cashfree.com/pg/orders/" + order_id,
                headers: {
                    accept: "application/json",
                    "x-api-version": "2022-09-01",
                    "x-client-id": '33168045e548176a9070ae7415086133',
                    "x-client-secret": 'bd51dbf947a404db202834c39ba10cb6f38cbdf9',
                    "content-type": "application/json",
                },
            };

            const response = await axios.request(options);


            if (response.data.order_status == "PAID") {

                let _id = req.session.user.id
                const orders = req.session.user.orders
                await orderModel.create(orders)
                let orderId = req.session.user.orderId
                const Log = req.session.user
                if (req.body.status) {
                    await userModel.updateOne({ _id }, { $addToSet: { address: address } })
                    await userModel.findByIdAndUpdate({ _id }, { $set: { cart: [] } })
                    res.render('orderSuccess', { Log })
                }
                else {
                    await userModel.findByIdAndUpdate({ _id }, { $set: { cart: [] } })
                    await orderModel.updateMany({ orderId }, { $set: { paid: true } })
                    console.log('sjfghsjdgfjkshgfgjksfdh');
                    res.render('orderSuccess', { Log })
                }
            } else {
                res.render('404 page')
            }


        } catch (err) {
            console.log(err);
            res.redirect('error-page')
        }


    }
    // getUserPasswordReset: async (req,res)=>{
    //     let form = req.body
    //     _id = req.session.user.id
    //     try{
    //         const password = await userModel.findOne({_id},{password})
    //         if(form.oldPass == password ){

    //         }


    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

}


module.exports = userController