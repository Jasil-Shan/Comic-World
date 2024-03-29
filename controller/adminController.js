const userModel = require('../models/usermodel')
const CategoryModel = require('../models/categoryModel')
const productModel = require('../models/ProductModel')
const adminModel = require('../models/adminModel')
var Handlebars = require('handlebars');
const multer = require('multer');
const BannerModel = require('../models/bannerModel');
const couponModel = require('../models/couponModel');
const orderModel = require('../models/orderModel');
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

var adminController = {

    getAdminlogin: (req, res) => {

        res.render('adminLogin')

    },

    postAdminLogin: async (req, res) => {

        const { email, password } = req.body
        let admin = await adminModel.findOne({ email })
        if (admin) {
            if (password == admin.password) {
                req.session.admin = {
                    name: admin.name,
                }
                res.redirect('/admin/dash')
            } else {
                res.render('adminLogin', { error: true })
            }
        } else {
            res.render('adminLogin', { error: true })
        }
    },

    getAdminUser: async (req, res) => {
        try {
            let users = await userModel.find({}, { password: 0 }).lean();
            console.log(users)
            if (req.session.admin) {
                res.render('adminUsermanage', {
                    users,
                    adminName: req.session.admin.name,
                })
            }
            else {
                res.redirect('/admin')
            }
        } catch (err) {
            console.log(err);
        }
    },
    getAdmindash: async (req, res) => {

        let salesCount = await orderModel.find({ orderStatus: 'Delivered' }).count();

        let monthlyDataArray = await orderModel.aggregate([{
            $match: { orderStatus: 'Delivered' }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                total: {
                    $sum: '$total'
                }
            }
        }])
        let monthlyDataObject = {}
        monthlyDataArray.map(item => {
            monthlyDataObject[item._id] = item.total
        })
        console.log(monthlyDataArray);
        let monthlyData = []
        for (let i = 1; i <= 12; i++) {
            monthlyData[i - 1] = monthlyDataObject[i] ?? 0
        }
        console.log(monthlyData);
        let salesSum = monthlyDataArray.reduce((a, curr) => a + curr.total, 0);
        let users = await orderModel.distinct('userId')
        let userCount = users.length

        res.render('admindash', { salesCount, salesSum, userCount, monthlyData })
    },
    getAdminproduct: async (req, res) => {
        try {
            let Product = await productModel.find({}).lean().sort({});   //getproducts
            if (req.session.admin) {
                res.render('adminProduct', { Product })
            }
            else {
                res.redirect('/admin/')
            }
        } catch (err) {
            console.log(err);
        }
    },

    getAdminUserBlock: (req, res) => {
        try {
            const _id = req.params.id
            userModel.findByIdAndUpdate(_id, { $set: { block: true } },
                function (err, data) {
                    if (err) {
                        res.redirect('/admin/user')
                    } else {
                        res.redirect('/admin/user')
                    }
                })
        } catch (err) {
            console.log(err);
        }
    },
    getAdminuserUnblock: (req, res) => {

        const _id = req.params.id
        userModel.findByIdAndUpdate(_id, { $set: { block: false } },
            function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect('/admin/user')
                }
            })
    },
    getadminlogout: (req, res) => {
        req.session.destroy()
        res.redirect('/admin/')

    },
    postadminSearch: async (req, res) => {
        try {
            const { key } = req.body;
            const users = await userModel.find({ name: new RegExp(key, "i") }).lean();
            res.render('adminUsermanage', { users });
        } catch (err) {

        }
    },
    getAdmincategory: async (req, res) => {
        try {
            let Category = await CategoryModel.find({}).lean();

            if (req.session.admin) {
                res.render('admincategory', { Category })
            }
            else {
                res.redirect('/admin/')
            }
        } catch (err) {
            console.log(err);
        }
    },
    getAdminAddCat: (req, res) => {
        res.render('adminAddCat')
    },
    postAdminAddCat: (req, res) => {
        try {
            const { Category, Sub } = req.body
            let category = new CategoryModel({ Category, Sub: Sub.split(',') })

            category.save((err, data) => {
                if (err) {
                    console.log(err)
                    res.render('adminAddCat', { error: true, message: 'something went wrong' })
                }
                else {
                    console.log('cat saved')
                    res.redirect("/admin/category")
                }
            })
        } catch (err) {
            console.log(err);
        }
    },
    getAdminCatDelete: (req, res) => {

        const _id = req.params.id

        CategoryModel.deleteOne({ _id }).then(() => {
            console.log('deleted succesfully')
            res.redirect('/admin/category')
        }).catch(err => {
            res.json(err)
            console.log(err)
        })

    },

    getAdminAddProduct: async (req, res) => {
        try {
            const result = await CategoryModel.find({}).lean();
            console.log(result)
            res.render('adminAddproducts', { result })
        } catch (err) {
            console.log(err);

        }
    },
    postAdminAddProduct: async (req, res) => {
        try {
            let mainImage = req.files.image
            let subImages = req.files.SubImage
            let imageFile = await cloudinary.uploader.upload(mainImage.path, { folder: 'Comic World' })
            let product = imageFile

            for (let i in subImages) {
                let imageFile = await cloudinary.uploader.upload(subImages[i].path, { folder: 'Comic World' })
                subImages[i] = imageFile
            }
            const { name, description, category, subCategory, mrp, price, stock, Status } = req.body

            let Product = new productModel({ name, description, category, subCategory, mrp, price, stock, Status })
            Product.save((err, data) => {
                if (err) {
                    console.log(err)
                    res.render('adminAddproducts', { error: true, message: 'something went wrong' })
                }
                else {
                    console.log('cat saved')
                    res.redirect("/admin/products")
                }
            })
        } catch (err) {
            console.log(err);
        }
    },
    getAdminDeleteProduct: (req, res) => {
        const _id = req.params.id

        productModel.deleteOne({ _id }).then(() => {
            console.log('deleted succesfully')
            res.redirect('/admin/products')
        }).catch(err => {
            res.json(err)
            console.log(err)
        })
    },

    putAdminEditProduct: async (req, res) => {                          //edit

        try {
            const _id = req.params.id;
            console.log(_id);
            const product = await productModel.findById(_id)
            const result = await CategoryModel.find({}).lean();
            console.log(product.name);

            res.render('EditAdminProduct', {
                result,
                _id,
                name: product.name,
                description: product.description,
                Category: product.category,
                subCategory: product.subCategory,
                mrp: product.mrp,
                price: product.price,
                Status: product.Status,
                stock: product.stock,
                image: product.image[0]
            })
        } catch (err) {
            console.log(err);
        }
    },
    postProductUpdate: async (req, res) => {

        try {
            let mainImage = req.files.image[0]
            console.log(mainImage);
            // let subImages = req.files.SubImage
            let imageFile = await cloudinary.uploader.upload(mainImage.path, { folder: 'Comic World' })
            console.log(imageFile);
            let product = imageFile
            
    
            // for (let i in subImages) {
            //     let imageFile = await cloudinary.uploader.upload(subImages[i].path, { folder: 'Comic World' })
            //     subImages[i] = imageFile
            // }
            const { _id, name, description, Category, subCategory, mrp, price, stock } = req.body
    
            productModel.findByIdAndUpdate(
                _id,
                { $set: { name, description, Category, subCategory, mrp, price, stock,image:product} },
                function (err, data) {
                    if (err) {
                        res.render("EditAdminProduct", { error: true });
                    } else {
                        res.redirect("/admin/products");
                    }
                }
            )
        }catch (err) {
            console.log(err);
        }
    },
    getEditCategory: async (req, res) => {                          //edit

        try {
            const _id = req.params.id;
            const Category = await CategoryModel.findById(_id)

            console.log(Category)

            res.render('AdminEditCategory', {
                _id,
                Category: Category.Category,
                Sub: Category.Sub

            })
        } catch (err) {
            console.log(err);
        }
    },
    postEditCategory: (req, res) => {

        const { _id, Category, Sub } = req.body

        CategoryModel.findByIdAndUpdate(_id, { $set: { Category, Sub: Sub.split(',') } },
            function (err, data) {
                if (err) {
                    res.render("AdminEditCategory", { error: true });
                } else {
                    console.log('updated')
                    res.redirect("/admin/category");
                }
            })

    },
    getAdminProductList: (req, res) => {

        const _id = req.params.id

        productModel.findByIdAndUpdate(_id, { $set: { Status: true } },
            function (err, data) {
                if (err) {
                    res.render('adminProduct', { error: true })
                } else {
                    res.redirect('/admin/products')
                }
            })
    },
    getAdminProductUnlist: (req, res) => {

        const _id = req.params.id
        productModel.findByIdAndUpdate(_id, { $set: { Status: false } },
            function (err, data) {
                if (err) {
                    res.render('adminProduct', { error: true })
                } else {
                    res.redirect('/admin/products')
                }
            })
    },
    postAdminSearchProduct: async (req, res) => {
        try {
            const { key } = req.body;
            const Product = await productModel.find({ name: new RegExp(key, "i") }).lean();
            res.render('adminProduct', { Product });
        } catch (err) {
            console.log(err);
        }
    },
    getAdminBanner: async (req, res) => {

        try {
            const Banners = await BannerModel.find({}).lean()
            res.render('adminBanner', { Banners })
        } catch (err) {
            console.log(err);
        }
    },

    getAdminAddBanner: async (req, res) => {

        res.render('adminAddBanner')
    },
    postAdminSaveBanner: async (req, res) => {

        try {

            let mainImage = req.files.image[0]
            // let subImages = req.files.SubImage[0]
            let imageFile = await cloudinary.uploader.upload(mainImage.path, { folder: 'Comic World' })
            let images = imageFile

            // for (let i in subImages) {
            //     let imageFile = await cloudinary.uploader.upload(subImages[i].path, { folder: 'Comic World' })
            //     subImages[i] = imageFile
            // }

            const { name, caption } = req.body
            let Banner = new BannerModel({ name, caption, image: images })
            Banner.save((err, data) => {
                if (err) {
                    console.log(err)
                    res.render('adminAddBanner', { error: true, message: 'something went wrong' })
                }
                else {
                    console.log('cat saved')
                    res.redirect("/admin/banner")
                }
            })
        } catch (err) {
            console.log(err);
        }
    },
    getAdminDeleteBanner: (req, res) => {

        const _id = req.params.id
        BannerModel.deleteOne({ _id }).then(() => {
            console.log('deleted succesfully')
            res.redirect('/admin/banner')
        }).catch(err => {
            res.json(err)
            console.log(err)
        })
    },
    getAdminCoupon: async (req, res) => {

        try {
            const Coupons = await couponModel.find({}).lean()
            res.render('AdminCoupon', { Coupons })
        } catch (err) {
            console.log(err);
        }
    },
    getAdminAddCoupon: (req, res) => {
        res.render('AdminAddCoupon')
    },
    postAdminAddCoupon: (req, res) => {
        try {
            const { name, code, minAmount, cashback } = req.body
            let expiry = req.body.expiry.toLocaleString()
            console.log(expiry);
            let Coupon = new couponModel({ name, code, minAmount, cashback, expiry })
            Coupon.save((err, data) => {
                if (err) {
                    console.log(err)
                    res.render('AdminAddCoupon', { error: true, message: 'something went wrong' })
                }
                else {
                    console.log('Coupon saved')
                    res.redirect("/admin/coupon")
                }
            })
        } catch (err) {
            console.log(err);
        }
    },
    getDeleteCoupon: async (req, res) => {
        try {
            _id = req.params.id
            await couponModel.findByIdAndDelete(_id)
            res.redirect('back')
        } catch (err) {
            console.log(err);
        }

    },
    getAdminOrderManage: async (req, res) => {
        try {
            let status = req.query.status
            const _id = req.query.id
            if (status) {
                if (status == "Delivered") {
                    await orderModel.updateOne({ _id }, { paid: true })
                }
                await orderModel.updateOne({ _id }, { orderStatus: status })
            }
            const Orders = await orderModel.find({}).sort()
            console.log(Orders);
            res.render("AdminOrder", { Orders })
            
        } catch (error) {
            console.log(error);
        }
    },
    getadminSalesReport: async (req, res) => {
        let from = req.query.from
        let to = req.query.to
        let products
        let salesCount
        let result
        let salesSum
        let order
        if (from) {
            order = await orderModel.find({ createdAt: { $gte: from, $lt: to } }).lean()
            products = order.filter(e => e.orderStatus == 'Delivered')
            salesCount = await orderModel.find({ createdAt: { $gte: from, $lt: to } }, { orderStatus: 'Delivered' }).count()

            salesSum = products.reduce((a, curr) => a + curr.total, 0);
        } else {
            products = await orderModel.find({ orderStatus: 'Delivered' })
            console.log(products);
            salesCount = await orderModel.find({ orderStatus: 'Delivered' }).count();
            result = await orderModel.aggregate([{
                $match: { orderStatus: 'Delivered' }
            },
            {
                $group: { 
                    _id: null,
                    total: {
                        $sum: '$total'
                    }
                }
            }])
            if (result[0].total) {
                salesSum = result[0].total;
            }
        }
        let users = await orderModel.distinct('userId')
        let userCount = users.length

        res.render('adminSalesReport', { products, userCount, salesCount, salesSum })
    },




}




module.exports = adminController



