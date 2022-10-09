const express = require('express');
const router = express.Router();
const usercontrol = require('../controller/user-controller')
const session = require('../middlewares/session_middleware');

/* GET home page. */
router.get('/signupPage', usercontrol.getSignupPage);

router.post('/signup', usercontrol.adduser)

router.get('/loginPage',usercontrol.getLoginPage)

router.post('/login',usercontrol.doLogin)

router.get('/getUserProfile/:id',usercontrol.getUserProfile)

router.get('/addAddress/:id',usercontrol.addAddress)

router.post('/postaddAddress/:id',usercontrol.postaddAddress)

router.get('/checkOut/:id',usercontrol.checkOut)

router.post('/billingAddress',usercontrol.billingAddress)

router.get('/shop',usercontrol.getAllProducts)

router.get('/viewProductByCategory/:id',usercontrol.viewProductByCategory)


router.get('/cart/:id',session.userSession,usercontrol.addToCart)

router.get('/showCart/:id',session.userSession,usercontrol.getCart)

router.post('/changeProductQuantity',usercontrol.changeProductQuantity)

router.post('/removeCartItem', usercontrol.removeCartItem)


router.get('/addToWishlist/:id',session.userSession,usercontrol.addToWishlist)

router.get('/getWishlist/:id',session.userSession,usercontrol.getWishlist)

router.post('/removeWishlistItem',session.userSession,usercontrol.removeWishlistItem)

router.get('/logout',usercontrol.logout)

router.get('/productDetails/:id',session.userSession,usercontrol.productDetails)


//router.post('/otpVerify',usercontrol.verifyOtp)

// router.get('/otp',(req,res)=>{
//     res.render('user/otp',{layout:false})
// })
module.exports = router;
