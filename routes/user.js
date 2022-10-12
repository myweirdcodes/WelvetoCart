const express = require('express');
const router = express.Router();
const usercontrol = require('../controller/user-controller')
const session = require('../middlewares/session_middleware');
const ordercontrol = require('../controller/orderController');
const razorpayController = require('../controller/razorpayController');

/* GET home page. */

// user Signup and login routes
router.get('/signupPage', usercontrol.getSignupPage);

router.post('/signup', usercontrol.adduser)

router.get('/loginPage',usercontrol.getLoginPage)

router.post('/login',usercontrol.doLogin)



// user profile routes

router.get('/getUserProfile/:id',session.userSession,usercontrol.getUserProfile)

router.get('/addAddress/:id',session.userSession,usercontrol.addAddress)

router.post('/postaddAddress/:id',session.userSession,usercontrol.postaddAddress)



// user checkout routes

router.get('/checkOut/:id',session.userSession,usercontrol.checkOut)

router.post('/billingAddress',usercontrol.billingAddress)

router.post('/confirmOrderButton',session.userSession,ordercontrol.confirmOrderButton)

router.post('/verifyRazorpay', session.userSession, ordercontrol.verifyPay);

router.get('/renderConfirmation', session.userSession, ordercontrol.confirmationPage) 



// user view products routes

router.get('/shop',usercontrol.getAllProducts)

router.get('/viewProductByCategory/:id',session.userSession,usercontrol.viewProductByCategory)

router.get('/productDetails/:id',session.userSession,usercontrol.productDetails)



// user cart routes

router.get('/cart/:id',session.userSession,usercontrol.addToCart)

router.get('/showCart/:id',session.userSession,usercontrol.getCart)

router.post('/changeProductQuantity',usercontrol.changeProductQuantity)

router.post('/removeCartItem', usercontrol.removeCartItem)



// user wishlist routes

router.get('/addToWishlist/:id',session.userSession,usercontrol.addToWishlist)

router.get('/getWishlist/:id',session.userSession,usercontrol.getWishlist)

router.post('/removeWishlistItem',session.userSession,usercontrol.removeWishlistItem)

router.get('/logout',usercontrol.logout)



// user otp routes

//router.post('/otpVerify',usercontrol.verifyOtp)

// router.get('/otp',(req,res)=>{
//     res.render('user/otp',{layout:false})
// })


module.exports = router;
