const cartModel = require("../model/cartSchema");
const wishlistModel = require("../model/wishlistSchema");



  module.exports = {
    getCartCount:async function(req, res) {
        let cart = await cartModel.findOne({ userId: req.session.user._id }).lean();
        let cartcount = 0;
        if (cart) {
          cartcount = cart.products.length;
        }
        return cartcount;
      },
      
      getWishlistCount:async function (req, res) {
        let wishlist = await wishlistModel
          .findOne({ userId: req.session.user._id })
          .lean();
        let wishlistcount = 0;
        if (wishlist) {
          wishlistcount = wishlist.products.length;
        }
        return wishlistcount;
      }
  }