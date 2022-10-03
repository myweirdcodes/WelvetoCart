const express = require('express');
const router = express.Router();
const usercontrol = require('../controller/user-controller')
const session = require('../middlewares/session_middleware');

/* GET home page. */
router.get('/signupPage', usercontrol.getSignupPage);

router.post('/signup', usercontrol.adduser)

router.get('/loginPage',usercontrol.getLoginPage)

router.post('/login',usercontrol.doLogin)

router.get('/shop',usercontrol.getAllProducts)

router.get('/viewProductByCategory/:id',usercontrol.viewProductByCategory)


router.get('/cart/:id',session.userSession,usercontrol.addToCart)

router.get('/showCart/:id',session.userSession,usercontrol.getCart)

router.get('/addToWishlist/:id',session.userSession,usercontrol.addToWishlist)

router.get('/getWishlist/:id',session.userSession,usercontrol.getWishlist)

router.get('/logout',usercontrol.logout)

router.get('/productDetails/:id',session.userSession,usercontrol.productDetails)

//router.post('/otpVerify',usercontrol.verifyOtp)

// router.get('/otp',(req,res)=>{
//     res.render('user/otp',{layout:false})
// })
module.exports = router;
