const express = require('express');
const router = express.Router();
const admincontrol = require('../controller/admin-controller');
const session = require('../middlewares/session_middleware')
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



router.get('/addProduct',session.adminSession,admincontrol.addProduct)

router.post('/addProduct',session.adminSession, upload.array('image',3),admincontrol.postAddProduct)

router.get('/addCategory',session.adminSession,admincontrol.addCategory)

router.post('/addCategory',session.adminSession,admincontrol.postAddCategory)

router.get('/viewProduct',session.adminSession,admincontrol.adminViewProduct)

router.get('/updateProduct/:id',session.adminSession,admincontrol.updateProduct)

router.get('/viewProduct',session.adminSession,admincontrol.adminViewProduct)

router.get('/', admincontrol.adminLoginPage);

router.post('/adminLogin',admincontrol.adminLogin)

router.get('/adminlogout',admincontrol.adminLogout)

router.get('/signupPage',admincontrol.adminSignupPage)

router.post('/signup',admincontrol.adminSignup)




router.get('/viewUser',session.adminSession,admincontrol.viewUser)


module.exports = router;