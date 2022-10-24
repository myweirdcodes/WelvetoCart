const userModel = require("../model/userSchema");
const productModel = require("../model/productSchema");
let cartModel = require("../model/cartSchema");
const orderModel = require("../model/orderSchema");
const couponModel = require("../model/couponSchema");

const cartFunctions = require("./cartFunctions");
const razorpayController = require("./razorpayController");
const count = require("../middlewares/cartWishlistcount");

module.exports = {
  confirmOrderButton: async (req, res, next) => {
    try {
      userId = req.session.user._id;

      let cartData = await cartModel
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();

      let totalAmount = await cartFunctions.totalAmount(cartData);

      if (req.session.coupon) {
        let discountAmount = req.session.coupon.discountAmount;

        totalAmount = totalAmount - discountAmount;
        //add userID to coupon //
        await couponModel.findOneAndUpdate(
          { _id: req.session.coupon._id },
          { $set: { users: userId } }
        );
      }

      let orderData = await orderModel.create({
        userId: userId,
        billingAddress: req.body,
        products: cartData.products,
        status: "pending",
        paymentMethod: req.body.paymentMethod,
        grandTotal: totalAmount,
      });

      let totalAmounts = totalAmount * 100;

      orderDataPopulated = await orderModel
        .findOne({ _id: orderData._id })
        .populate("products.productId")
        .lean();

      req.session.orderData = orderData;

      if (orderData.paymentMethod == "COD") {
        req.session.orderData = null;

        req.session.confirmationData = { orderDataPopulated, totalAmount };

        await cartModel.deleteOne({ userId: req.session.user._id });
        await orderModel.findOneAndUpdate(
          { _id: orderData._id },
          { status: "placed" }
        );

        // this is for stock managment in the admin side
        let orderDataone = await orderModel.findOne({ _id: orderData._id });

        let orderArr = orderDataone.products;

        for (i = 0; i < orderArr.length; i++) {
          let qty = -orderArr[i].quantity;

          await productModel.updateOne(
            { _id: orderArr[i].productId },
            { $inc: { stock: qty } }
          );
        }

        res.json({ status: "COD", totalAmounts, orderData });
      } else if (orderData.paymentMethod == "Online Payment") {
        let orderData = req.session.orderData;

        razorData = await razorpayController.generateRazorpy(
          orderData._id,
          totalAmounts
        );

        await orderModel.findOneAndUpdate(
          { _id: orderData._id },
          { orderId: razorData.id }
        );

        razorId = process.env.RAZOR_PAY_ID;

        req.session.confirmationData = { orderDataPopulated, totalAmount };

        res.json({ message: "success", totalAmounts, razorData, orderData });
      }
    } catch (error) {
      next(error);
    }
  },
  verifyPay: async (req, res, next) => {
    try {
      success = await razorpayController.validate(req.body);
      if (success) {
        await orderModel.findOneAndUpdate(
          { orderId: req.body["razorData[id]"] },
          { status: "placed" }
        );
        await cartModel.deleteOne({ userId: req.session.user._id });

        // this is for stock managment in the admin side
        let orderData = req.session.orderData;
        req.session.orderData = null;
        let orderDataone = await orderModel.findOne({ _id: orderData._id });

        let orderArr = orderDataone.products;

        for (i = 0; i < orderArr.length; i++) {
          let qty = -orderArr[i].quantity;

          await productModel.updateOne(
            { _id: orderArr[i].productId },
            { $inc: { stock: qty } }
          );
        }

        return res.json({ status: "true" });
      } else {
        await orderModel.findOneAndUpdate(
          { orderId: req.body["razorData[id]"] },
          { status: "failed" }
        );
        return res.json({ status: "failed" });
      }
    } catch (error) {
      next(error);
    }
  },
  confirmationPage: (req, res, next) => {
    try {
      orderDataPopulated = req.session.confirmationData.orderDataPopulated;
      totalAmount = req.session.confirmationData.totalAmount;
      req.session.confirmationData = null;
      res.render("user/orderConfirmation", { orderDataPopulated, totalAmount });
    } catch (error) {
      next(error);
    }
  },
  myOrders: async (req, res, next) => {
    try {
      let orderData = await orderModel
        .find({ userId: req.session.user._id }).sort({createdAt:-1})
        .populate("products.productId")
        .lean();
      for (let i = 0; i < orderData.length; i++) {
        if (orderData[i].status == "cancelled") {
          orderData[i].cancelled = true;
        } else if (orderData[i].status == "delivered") {
          orderData[i].delivered = true;
        }
      }
      let cartcount = await count.getCartCount(req, res);
      let wishlistcount = await count.getWishlistCount(req, res);

      res.render("user/myOrders", {
        orderData,
        inUse: true,
        user: req.session.user,
        cartcount,
        wishlistcount,
      });
    } catch (error) {
      next(error);
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      await orderModel.updateOne(
        { _id: req.body.orderId },
        { $set: { status: "cancelled" } }
      );
      res.json({ cancelledOrder: true });
    } catch (error) {
      next(error);
    }
  },
  orderDetails: async(req,res,next)=>{
    try{
      let orderData = await orderModel.findOne({_id:req.params.id}).populate("products.productId").lean()
      if (orderData.status == "cancelled") {
        orderData.cancelled = true;
      } else if (orderData.status == "delivered") {
        orderData.delivered = true;
      }
      res.render('user/orderDetails',{inUse: true,
        user: req.session.user,orderData})
    }catch (error) {
      next(error);
    }
    
  }
};
