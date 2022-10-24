const express = require('express');
const router = express.Router();
const admincontrol = require('../controller/admin-controller');
const session = require('../middlewares/session_middleware')
const couponRoutes = require('../controller/couponController');
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/product_uploads')
  },
  filename: function(req,file,cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null,uniqueSuffix + '-' +file.originalname )
  }
})

const upload = multer({ storage: storage })

/* GET users listing. */


// admin category managment routes

router.get('/addCategory',session.adminSession,admincontrol.addCategory)

router.post('/addCategory',session.adminSession,admincontrol.postAddCategory)

router.post('/deleteCategory',session.adminSession,admincontrol.deleteCategory)

router.get('/editCategory/:id',session.adminSession,admincontrol.editCategory)

router.post('/postEditCategory/:id',session.adminSession,admincontrol.postEditCategory)

// admin product managment routes

router.get('/addProduct',session.adminSession,admincontrol.addProduct)

router.post('/addProduct',session.adminSession, upload.array('image',3),admincontrol.postAddProduct)


router.get('/viewProduct',session.adminSession,admincontrol.adminViewProduct)

router.get('/updateProduct/:id',session.adminSession,admincontrol.updateProduct)

router.post('/postUpdateProduct/:id',session.adminSession,upload.array('image',3),admincontrol.postUpdateProduct)

router.get('/deleteProduct/:id',session.adminSession,admincontrol.deleteProduct)

router.get('/viewProduct',session.adminSession,admincontrol.adminViewProduct)




// admin user managment routes

router.get('/viewUser',session.adminSession,admincontrol.viewUser)

router.get('/blockUnblockUser/:id',session.adminSession,admincontrol.blockUnblockUser)





//admin order managment routes

router.get('/viewOrders',session.adminSession,admincontrol.viewOrders)

router.post('/postEditStat',session.adminSession,admincontrol.postEditStat)


// admin login routes

router.get('/', admincontrol.adminLoginPage);

router.post('/adminLogin',admincontrol.adminLogin)

router.get('/adminlogout',admincontrol.adminLogout)




//admin coupon routes

router.get('/addCoupon',couponRoutes.renderAddCoupon)
router.post('/addCoupon',couponRoutes.addCoupon)
router.get('/viewCoupon',couponRoutes.couponTable)
router.get('/editCoupon/:id',couponRoutes.renderEditCoupon)
router.post('/editCoupon/:id',couponRoutes.editCoupon);
router.get('/deleteCoupon/:id',couponRoutes.deleteCoupon)


//admin dashboard routes

router.get('/dashboard',admincontrol.renderDashboard)
router.post('/dashboardGraph',admincontrol.graphData)




// admin signup routes

router.get('/signupPage',admincontrol.adminSignupPage)

router.post('/signup',admincontrol.adminSignup)


router.use(function(req, res, next) {
  next(createError(404));
});

// error handler
router.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('admin/error');
});




module.exports = router;