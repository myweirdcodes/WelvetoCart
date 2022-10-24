const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../model/userSchema");
const productModel = require("../model/productSchema");
const categoryModel = require("../model/categorySchema");
const cartModel = require("../model/cartSchema");
const wishlistModel = require("../model/wishlistSchema");
const addressModel = require("../model/addressSchema");
const couponModel = require("../model/couponSchema");
const cartFunctions = require("./cartFunctions");
const count = require("../middlewares/cartWishlistcount");
const bcrypt = require("bcrypt");
const otp = require("./otp");
const { response } = require("express");
var objectId = require("mongodb").ObjectID;

module.exports = {
  getLoginPage: (req, res, next) => {
    try {
      if (req.session.loggedIn) {
        return res.redirect("/shop");
      }
      res.render("user/login");
    } catch (error) {
      next(error);
    }
  },
  getSignupPage: (req, res, next) => {
    try {
      if (req.session.loggedIn) {
        res.redirect("/shop");
      } else {
        res.render("user/register");
      }
    } catch (error) {
      next(error);
    }
  },
  adduser: async (req, res, next) => {
    try {
      let emailExist = await usersModel.findOne({ email: req.body.email });
      if (emailExist) {
        return res.send("user already existt");
      }
      const newuser = await usersModel.create(req.body);

      const id = newuser._id;

      req.session.user = newuser;
      req.session.phone = req.body.phone;

      otp.sendOtp(req.body.phone);

      res.render("user/otp", { id });
    } catch (error) {
      next(error);
    }
  },
  doLogin: async (req, res, next) => {
    try {
      let user = await usersModel.findOne({ email: req.body.email });

      if (user) {
        if (user.status) {
          let userTrue = await bcrypt.compare(req.body.password, user.password);

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
    } catch (error) {
      next(error);
    }
  },
  getAllProducts: async (req, res, next) => {
    try {
      let productData = await productModel.find().lean();
      let categoryData = await categoryModel.find().lean();

      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);

      res.render("user/view-products", {
        user: req.session.user,
        inUse: true,
        productData,
        categoryData,
        cartcount,
        wishlistcount,
      });
    } catch (error) {
      next(error);
    }
  },
  viewProductByCategory: async function (req, res, next) {
    try {
      let productData = await productModel
        .find({ category: objectId(req.params.id) })
        .lean();

      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);
      res.render("user/productsByCategory", {
        productData,
        inUse: true,
        user: req.session.user,
        cartcount,
        wishlistcount,
      });
    } catch (error) {
      next(error);
    }
  },
  addToCart: async (req, res, next) => {
    try {
      let productId = req.params.id;
      let userId = req.session.user._id;

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
          res.json({ quantityIncrement: true });
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
    } catch (error) {
      next(error);
    }
  },
  getCart: async (req, res, next) => {
    try {
      let cartData = await cartModel
        .findOne({ userId: req.session.user._id })
        .populate("products.productId")
        .lean();

      let wishlistcount = await count.getWishlistCount(req, res);
      if (cartData) {
        let cartcount = await count.getCartCount(req, res);

        let totalAmount = await cartFunctions.totalAmount(cartData);

        res.render("user/cart", {
          inUse: true,
          cartData,
          user: req.session.user,
          cartcount,
          wishlistcount,
          totalAmount,
        });
      } else {
        let cartcount = await count.getCartCount(req, res);
        res.render("user/cart", {
          inUse: true,
          user: req.session.user,
          cartcount,
          wishlistcount,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  logout: (req, res, next) => {
    try {
      req.session.user = null;
      req.session.loggedIn = false;
      res.redirect("/loginPage");
    } catch (error) {
      next(error);
    }
  },

  post_Otp: async function (req, res, next) {
    try {
      let response = await otp.verifyOtp(req.session.phone, req.body.otp);

      if (response.valid) {
        req.session.loggedIn = true;

        res.redirect("/shop");
      } else {
        await usersModel.deleteOne({ _id: req.session.user._id });
        req.session.user = null;
        res.redirect("/signupPage");
      }
    } catch (error) {
      next(error);
    }
  },
  productDetails: async (req, res, next) => {
    try {
      let productdetails = await productModel
        .findOne({ _id: req.params.id })
        .populate("category")
        .lean();

      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);
      res.render("user/productDetails", {
        user: req.session.user,
        inUse: true,
        productdetails,
        wishlistcount,
        cartcount,
      });
    } catch (error) {
      next(error);
    }
  },
  addToWishlist: async (req, res, next) => {
    try {
      let productId = req.params.id;
      let userId = req.session.user._id;

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
    } catch (error) {
      next(error);
    }
  },
  getWishlist: async (req, res, next) => {
    try {
      let wishlistData = await wishlistModel
        .findOne({ userId: req.session.user._id })
        .populate("products.productId")
        .lean();

      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);
      res.render("user/wishlist", {
        inUse: true,
        wishlistData,
        user: req.session.user,
        wishlistcount,
        cartcount,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserProfile: async (req, res, next) => {
    try {
      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);
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
    } catch (error) {
      next(error);
    }
  },
  postChangeName: async (req, res, next) => {
    try {
      await usersModel.updateOne(
        { _id: req.session.user._id },
        { $set: { name: req.body.name } }
      );

      res.json({ nameChanged: true });
    } catch (error) {
      next(error);
    }
  },
  addAddress: async (req, res, next) => {
    try {
      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);
      res.render("user/addAddress", {
        inUse: true,
        user: req.session.user,
        cartcount,
        wishlistcount,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      await addressModel.deleteOne({ _id: req.body.addressId });
      res.json({ addressDeleted: true });
    } catch (error) {
      next(error);
    }
  },
  postaddAddress: async (req, res, next) => {
    try {
      await addressModel.create(req.body);
      res.redirect("/getUserProfile/:id");
    } catch (error) {
      next(error);
    }
  },
  changeProductQuantity: async (req, res, next) => {
    try {
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

        let totalAmount = await cartFunctions.totalAmount(cartData);

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

        res.json({ status: true, price, totalAmount });
      }
    } catch (error) {
      next(error);
    }
  },
  removeCartItem: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },
  checkOut: async (req, res, next) => {
    try {
      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);
      let addressData = await addressModel
        .find({ userId: req.session.user._id })
        .lean();
      let cartData = await cartModel
        .findOne({ userId: req.session.user._id })
        .populate("products.productId")
        .lean();
      let totalAmount = await cartFunctions.totalAmount(cartData);
      let couponData = await couponModel.find().lean();
      res.render("user/checkOut", {
        inUse: true,
        user: req.session.user,
        cartcount,
        wishlistcount,
        addressData,
        cartData,
        totalAmount,
        couponData,
      });
    } catch (error) {
      next(error);
    }
  },
  billingAddress: async (req, res, next) => {
    try {
      let address = await addressModel
        .findOne({ _id: req.body.address })
        .lean();
      res.json({ message: "this is succesfully", address });
    } catch (error) {
      next(error);
    }
  },
  removeWishlistItem: async (req, res, next) => {
    try {
      await wishlistModel.updateOne(
        { _id: req.body.wishlistId },
        {
          $pull: { products: { productId: req.body.prodId } },
        }
      );
      res.json({ removeWishlistItem: true });
    } catch (error) {
      next(error);
    }
  },
};
