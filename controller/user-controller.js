const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const usersModel = require('../model/userSchema');
const productModel = require('../model/productSchema')
const categoryModel = require('../model/categorySchema')
const cartModel = require('../model/cartSchema');
const bcrypt = require('bcrypt');
const otp = require('./otp')
const { response } = require('express');




module.exports = {
    // verifyLogin:(req,res,next)=>{
    //     if(req.session.loggedIn){
    //         next();
    //     }
    //     else{
    //         res.redirect('/loginPage')
    //     }
    // },
    getLoginPage:(req,res)=>{
        if(req.session.loggedIn){
           return res.redirect("/shop")
        }
        res.render('user/login')
    },
    getSignupPage:(req,res)=>{
        if(req.session.loggedIn){
            res.redirect('/shop')
        }
        else{
            res.render('user/register')
        }
    },
    adduser: async(req,res)=>{
        let emailExist = await usersModel.findOne({email:req.body.email});
        if(emailExist){
            console.log('user already exist');
            return res.send('user already existt');
        }
        console.log(req.body,"adduser")
        const newuser = await usersModel.create(req.body);
        console.log(newuser,'adduser2');
        otp.doSms(newuser)
        const id = newuser._id
        console.log(id, "adduser3")
        req.session.user = newuser
        console.log(req.session.user,"adduser 4")
        req.session.loggedIn = true
        res.redirect('/shop')
        //res.render('user/otp')
    },
    doLogin: async(req,res)=>{
        console.log(req.body,"doLogin 1")
        let user = await usersModel.findOne({email:req.body.email});
        console.log(user,"doLogin 2")
        if(user){
            let userTrue = await bcrypt.compare(req.body.password,user.password)
            console.log(userTrue,"doLogin 3")
            if(userTrue){
                req.session.user = user
                req.session.loggedIn = true
                res.redirect('/shop')
            }
        }
        else{
            res.send('user does not exist')
        }
        return user
    },
    getAllProducts: async(req,res)=>{
        
        console.log(req.session.loggedIn, "getAllProducts 1")
        let productData = await productModel.find().lean()
        let categoryData = await categoryModel.find().lean()
        console.log(req.session.user,'getAllproducts 1')
        res.render('user/view-products',{user:req.session.user,inUse:true,productData,categoryData})
    //     if(req.session.loggedIn){
    //     }
    //     else{
    //         res.redirect('/loginPage')
    //     }
    }
    ,
    addToCart:async(req,res)=>{
        if(req.session.loggedIn){
            let productId = req.params.id
            let userId = req.session.user._id
            console.log(req.session.loggedIn, 'getCartProducts 1')
            console.log(req.session.user, 'getCartProducts 2')
            let userCart = await cartModel.findOne({userId:userId}).lean()
            if(userCart){
               productExist = await cartModel.findOne({userId:userId,"products.productId":productId});
               if(productExist){
                await cartModel.updateOne({userId:userId,"products.productId":productId},{$inc:{"products.$.quantity":1}})
               }
               else{
                await cartModel.findOneAndUpdate({userId:userId},{$push:{products:{productId:productId,quantity:1}}})
               }
            }else{
              await cartModel.create({userId:userId,products:{productId:productId,quantity:1}})
            }
            res.redirect('/showCart/:id')
        }
        else{
            res.redirect('/loginPage')
        }
    },
    getCart:async(req,res)=>{
        if(req.session.loggedIn){
            let cartData = await cartModel.findOne({userId:req.session.user._id}).populate('products.productId').lean()
            console.log(cartData,'getCart 1')
            console.log(cartData.userId,'getCart ')
            res.render('user/cart',{inUse:true,cartData,user:req.session.user})
            
        }
    },
    logout:(req,res)=>{
       req.session.user = null;
       req.session.loggedIn = false;
       res.redirect('/loginPage')
    },
    // verifyOtp: async(req,res)=>{
    //     const userdata = await usersModel.findOne({_id:req.params.id}).lean();
    //     const otps = req.body.otp
    //     const verification = await otp.otpVerify(otps,userdata)
    //     if(verification){
    //         req.session.loggedIn= true;
    //         res.redirect('/shop')
    //     }
    //     else{
    //         res.redirect('/signupPage')
    //     }
    // }
    productDetails:async(req,res)=>{
        let productdetails = await productModel.findOne({_id:req.params.id}).lean();
        console.log(productdetails.image[0],'productdetails 1')
        console.log(productdetails,"brrrrrrrrrrrr");
        res.render('user/productDetails',{user:req.session.user,inUse:true,productdetails})
    }
    
}