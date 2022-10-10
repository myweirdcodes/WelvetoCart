const userModel = require("../model/userSchema");
const productModel = require("../model/productSchema");
let cartModel = require("../model/cartSchema")
const orderModel = require("../model/orderSchema")
const cartFunctions = require("./cartFunctions")

module.exports = {
    confirmOrderButton: async (req, res) => {
        userId = req.session.user._id
        // console.log("prrrrrr")
        console.log("confirm order section:", req.body)
        // console.log("payment method from order",req.body.paymentMethod)


        let cartData = await cartModel.findOne({ userId: userId }).populate('products.productId').lean()
        console.log("cartData from checkout page page::",cartData);

        let orderData = await orderModel.create({ userId: userId, "billingAddress": req.body, "products": cartData.products, "status": "pending", "paymentMethod": req.body.paymentMethod })

        totalAmount = await cartFunctions.totalAmount(cartData);
        console.log("totalAmount",totalAmount);
        totalAmounts = totalAmount * 100;
        orderDataPopulated = await orderModel.findOne({ _id: orderData._id }).populate("products.productId").lean();


        req.session.orderData = orderData
        console.log("orderdata session", req.session)
        if (orderData.paymentMethod == 'COD') {
            req.session.orderData = null;
            console.log('hello from cod check in oredercontroller')
            req.session.confirmationData = { orderDataPopulated, totalAmount };
            res.json({ status: "COD", totalAmounts, orderData })
        } else if (orderData.paymentMethod == 'Online Payment') {
            // let orderData = req.session.orderData
            // req.session.orderData = null;
            // console.log("order data ajax:", orderData._id)
            // console.log("amount data ajax:", totalAmounts)
            // console.log("session data ajax:", req.session)
            // razorData = await razorpayController.generateRazorpy(orderData._id, totalAmounts)
            

            // await orderModel.findOneAndUpdate({ _id: orderData._id }, { orderId: razorData.id });
            // console.log("razordata returns;",razorData);
            // razorId = process.env.RAZOR_PAY_ID;

            // req.session.confirmationData = { orderDataPopulated, totalAmount };
            
            // res.json({ message: 'success', totalAmounts, razorData, orderData });
        }
        // res.json(orderData)

    },
    confirmationPage: (req, res, next) => {
        console.log(req.session.confirmationData);
        orderDataPopulated = req.session.confirmationData.orderDataPopulated
        totalAmount = req.session.confirmationData.totalAmount; 
        req.session.confirmationData = null;
        res.render('user/orderConfirmation',{ orderDataPopulated, totalAmount });
    }
}