const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../model/userSchema");
const productModel = require("../model/productSchema");
const categoryModel = require("../model/categorySchema");
const cartModel = require("../model/cartSchema");
const wishlistModel = require("../model/wishlistSchema");
const addressModel = require("../model/addressSchema");
const cartFunctions = require("./cartFunctions");
const bcrypt = require("bcrypt");
const otp = require("./otp");
const { response } = require("express");
var objectId = require("mongodb").ObjectID;

async function getCartCount(req, res) {
  let cart = await cartModel.findOne({ userId: req.session.user._id }).lean();
  let cartcount = 0;
  if (cart) {
    cartcount = cart.products.length;
  }
  return cartcount;
}

async function getWishlistCount(req, res) {
  let wishlist = await wishlistModel
    .findOne({ userId: req.session.user._id })
    .lean();
  let wishlistcount = 0;
  if (wishlist) {
    wishlistcount = wishlist.products.length;
  }
  return wishlistcount;
}

module.exports = {
  getLoginPage: (req, res) => {
    if (req.session.loggedIn) {
      return res.redirect("/shop");
    }
    res.render("user/login");
  },
  getSignupPage: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/shop");
    } else {
      res.render("user/register");
    }
  },
  adduser: async (req, res) => {
    let emailExist = await usersModel.findOne({ email: req.body.email });
    if (emailExist) {
      return res.send("user already existt");
    }
    const newuser = await usersModel.create(req.body);
    console.log('vili vannu')
    //const phone = newuser.phone
    //console.log(phone,'adduser 4')
    //otp.doSms(phone);
    const id = newuser._id;
    
    console.log(id, "adduser3");
    //req.session.user = newuser;

    req.session.user = newuser
    req.session.phone = req.body.phone

    otp.sendOtp(req.body.phone)

    //req.session.loggedIn = true;
    //res.redirect("/shop");
    res.render('user/otp',{id})
  },
  doLogin: async (req, res) => {
    console.log(req.body, "doLogin 1");
    let user = await usersModel.findOne({ email: req.body.email });
    console.log(user, "doLogin 2");
    if (user) {
      if (user.status) {
        let userTrue = await bcrypt.compare(req.body.password, user.password);
        console.log(userTrue, "doLogin 3");
        if (userTrue) {
          req.session.user = user;
          req.session.loggedIn = true;

          res.redirect("/shop");
        } else {
          res.send("wrong password");
        }
      } else {
        res.send("you have been blocked");
      }
    } else {
      res.send("user does not exist");
    }
    return user;
  },
  getAllProducts: async (req, res) => {
    let productData = await productModel.find().lean();
    let categoryData = await categoryModel.find().lean();

    let cartcount = await getCartCount(req, res);
    let wishlistcount = await getWishlistCount(req, res);

    res.render("user/view-products", {
      user: req.session.user,
      inUse: true,
      productData,
      categoryData,
      cartcount,
      wishlistcount,
    });
  },
  viewProductByCategory: async function (req, res) {
    console.log(req.params.id, "viewProductByCategory 0");
    //    let categoryData = await categoryModel.findOne({_id:req.params.id}).lean()

    let productData = await productModel
      .find({ category: objectId(req.params.id) })
      .lean();

    let cartcount = await getCartCount(req, res);
    let wishlistcount = await getWishlistCount(req, res);
    res.render("user/productsByCategory", {
      productData,
      inUse: true,
      user: req.session.user,
      cartcount,
      wishlistcount,
    });
  },
  addToCart: async (req, res) => {
    console.log("api call, add to cart 0");
    let productId = req.params.id;
    let userId = req.session.user._id;
    console.log(req.session.loggedIn, "addToCart 1");
    console.log(req.session.user, "addToCart 2");
    let userCart = await cartModel.findOne({ userId: userId }).lean();
    if (userCart) {
      productExist = await cartModel.findOne({
        userId: userId,
        "products.productId": productId,
      });
      if (productExist) {
        await cartModel.updateOne(
          { userId: userId, "products.productId": productId },
          { $inc: { "products.$.quantity": 1 } }
        );
        res.json({quantityIncrement:true})
      } else {
        await cartModel.findOneAndUpdate(
          { userId: userId },
          { $push: { products: { productId: productId, quantity: 1 } } }
        );
        res.json({ status: true });
      }
    } else {
      await cartModel.create({
        userId: userId,
        products: { productId: productId, quantity: 1 },
      });
      res.json({ status: true });
    }
  },
  getCart: async (req, res) => {
    let cartData = await cartModel
      .findOne({ userId: req.session.user._id })
      .populate("products.productId")
      .lean();
    console.log(cartData, "getCart 1");
    //console.log(cartData.products.productId, "getCart ");
    
    let wishlistcount = await getWishlistCount(req, res);
    if(cartData){
    let cartcount = await getCartCount(req, res);
    
    let totalAmount = await cartFunctions.totalAmount(cartData);
     
    res.render("user/cart", {
      inUse: true,
      cartData,
      user: req.session.user,
      cartcount,
      wishlistcount,
      totalAmount,
    });
  }
  else{
    let cartcount = await getCartCount(req, res);
    res.render("user/cart", {
      inUse: true,
      user: req.session.user,
      cartcount,
      wishlistcount,
    });
  }
  },
  logout: (req, res) => {
    req.session.user = null;
    req.session.loggedIn = false;
    res.redirect("/loginPage");
  },
 
  post_Otp:async function(req, res, next){
    console.log(req.body)
   let response =await otp.verifyOtp(req.session.phone, req.body.otp)
      console.log(response)
  
      console.log(req.session.phone, "sessionbody")
      if (response.valid) {
  
        req.session.loggedIn=true
        
        res.redirect('/shop')
      }
      else {
        await usersModel.deleteOne({_id:req.session.user._id})
        req.session.user = null;
        res.redirect('/signupPage')
      }
  
    
  },
  productDetails: async (req, res) => {
    let productdetails = await productModel
      .findOne({ _id: req.params.id })
      .populate("category")
      .lean();
    // console.log(productdetails.image[0], "productdetails 1");
    // console.log(productdetails.category.category, "brrrrrrrrrrrr");
    let cartcount = await getCartCount(req, res);
    let wishlistcount = await getWishlistCount(req, res);
    res.render("user/productDetails", {
      user: req.session.user,
      inUse: true,
      productdetails,
      wishlistcount,
      cartcount,
    });
  },
  addToWishlist: async (req, res) => {
    let productId = req.params.id;
    let userId = req.session.user._id;
    console.log(productId, "addToWishlist 3");
    console.log(userId, "addtoWishlist 4");
    console.log(req.session.loggedIn, "addToWishlist 1");
    console.log(req.session.user, "addtoWishlist 2");
    let userWishlist = await wishlistModel.findOne({ userId: userId }).lean();
    if (userWishlist) {
      productExist = await wishlistModel.findOne({
        userId: userId,
        "products.productId": productId,
      });
      if (productExist) {
        res.redirect("/shop");
      } else {
        await wishlistModel.findOneAndUpdate(
          { userId: userId },
          { $push: { products: { productId: productId } } }
        );
        res.json({ status: true });
      }
    } else {
      await wishlistModel.create({
        userId: userId,
        products: { productId: productId },
      });
      res.json({ status: true });
    }

    // res.redirect("/shop");
  },
  getWishlist: async (req, res) => {
    let wishlistData = await wishlistModel
      .findOne({ userId: req.session.user._id })
      .populate("products.productId")
      .lean();
    //   console.log(wishlistData, "getWishlist 1");
    //   console.log(wishlistData.userId, "getWishlist 2 ");
    let cartcount = await getCartCount(req, res);
    let wishlistcount = await getWishlistCount(req, res);
    res.render("user/wishlist", {
      inUse: true,
      wishlistData,
      user: req.session.user,
      wishlistcount,
      cartcount,
    });
  },

  getUserProfile: async (req, res) => {
    let cartcount = await getCartCount(req, res);
    let wishlistcount = await getWishlistCount(req, res);
    let userDetails = await usersModel
      .findOne({ _id: req.session.user._id })
      .lean();
    let addressData = await addressModel
      .find({ userId: req.session.user._id })
      .lean();
    res.render("user/userProfile", {
      inUse: true,
      user: req.session.user,
      cartcount,
      wishlistcount,
      userDetails,
      addressData,
    });
  },
  addAddress: async (req, res) => {
    let cartcount = await getCartCount(req, res);
    let wishlistcount = await getWishlistCount(req, res);
    res.render("user/addAddress", {
      inUse: true,
      user: req.session.user,
      cartcount,
      wishlistcount,
    });
  },
  postaddAddress: async (req, res) => {
    console.log(req.body, "postaddaddress 1");
    await addressModel.create(req.body);
    res.redirect("/getUserProfile/:id");
  },
  changeProductQuantity: async (req, res) => {
    console.log(
      req.body.cartId,
      req.body.prodId,
      req.body.count,
      req.body.quantity,
      "changeproductquantity 1"
    );
    // let count = parseInt(details.count)

    if (req.body.count == -1 && req.body.quantity == 1) {
      await cartModel.updateOne(
        { _id: req.body.cartId },
        {
          $pull: { products: { productId: req.body.prodId } },
        }
      );
      let cartData = await cartModel
        .findOne({ _id: req.body.cartId })
        .populate("products.productId")
        .lean();
      // let price = cartData.products[req.body.index].productId.price*cartData.products[req.body.index].quantity
      let totalAmount = await cartFunctions.totalAmount(cartData);
      //console.log(price,totalAmount,'changeproductQuantity 2 usercontroler.js')

      res.json({ removeProduct: true, totalAmount });
    } else {
      await cartModel.updateOne(
        { _id: req.body.cartId, "products.productId": req.body.prodId },
        { $inc: { "products.$.quantity": req.body.count } }
      );
      let cartData = await cartModel
        .findOne({ _id: req.body.cartId })
        .populate("products.productId")
        .lean();
      let price =
        cartData.products[req.body.index].productId.price *
        cartData.products[req.body.index].quantity;
      let totalAmount = await cartFunctions.totalAmount(cartData);
      console.log(
        price,
        totalAmount,
        "changeproductQuantity 3 usercontroler.js"
      );

      res.json({ status: true, price, totalAmount });
      console.log("success");
    }
  },
  removeCartItem: async (req, res) => {
    console.log(req, "hai");
    await cartModel.updateOne(
      { _id: req.body.cartId },
      {
        $pull: { products: { productId: req.body.prodId } },
      }
    );
    let cartData = await cartModel
      .findOne({ _id: req.body.cartId })
      .populate("products.productId")
      .lean();
    let totalAmount = await cartFunctions.totalAmount(cartData);

    res.json({ removeItem: true });
  },
  checkOut: async (req, res) => {
    let cartcount = await getCartCount(req, res);
    let wishlistcount = await getWishlistCount(req, res);
    let addressData = await addressModel
      .find({ userId: req.session.user._id })
      .lean();
    let cartData = await cartModel
      .findOne({ userId: req.session.user._id })
      .populate("products.productId")
      .lean();
    let totalAmount = await cartFunctions.totalAmount(cartData);
    res.render("user/checkOut", {
      inUse: true,
      user: req.session.user,
      cartcount,
      wishlistcount,
      addressData,
      cartData,
      totalAmount,
    });
  },
  billingAddress: async (req, res) => {
    let address = await addressModel.findOne({ _id: req.body.address }).lean();
    res.json({ message: "this is succesfully", address });
  },
  removeWishlistItem: async (req, res) => {
    console.log(req, "remove wishlist item 1");
    await wishlistModel.updateOne(
      { _id: req.body.wishlistId },
      {
        $pull: { products: { productId: req.body.prodId } },
      }
    );
    res.json({ removeWishlistItem: true });
  },
};
