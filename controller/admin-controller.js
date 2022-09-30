const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminModel = require('../model/adminSchema')
const categoryModel = require('../model/categorySchema')
const productModel = require('../model/productSchema');
const { response } = require('../app');


module.exports = {
    adminSignupPage: (req,res)=>{
        res.render('admin/signup',{layout:'admin-layout'})
    },
    adminLoginPage:(req,res)=>{
        console.log(req.session.adminLoggedIn, 'adminLoginPage 1')
       if(req.session.adminLoggedIn){
        res.redirect('/admin/viewProduct')
       }
       else{
        res.render('admin/adminLogin',{layout:'admin-layout'})
       }
    },
    adminSignup: async(req,res)=>{
        let adminexist = await adminModel.findOne({email:req.body.email})
        if(adminexist){
            res.send('admin already exist')
        }
        else{
          let newadmin = await adminModel.create(req.body)
        
            res.redirect('/admin')
          
        }
    },
    adminLogin: async(req,res)=>{
       let currentadmin = await adminModel.findOne({email:req.body.email})
       if(currentadmin){
         let adminTrue = await bcrypt.compare(req.body.password,currentadmin.password)
         console.log(adminTrue, 'adminLogin 0')
         if(adminTrue){
            console.log(adminTrue, 'adminLogin 1')
            req.session.admin = currentadmin
            console.log(req.session.admin, 'adminLogin 2')
            req.session.adminLoggedIn = true
            console.log(req.session.adminLoggedIn,'adminLogin 3')
            res.redirect('/admin/viewProduct')
         }
       }
       else{
        res.send('admin does not exist')
       }
    },
    adminViewProduct:async(req,res)=>{
       if(req.session.adminLoggedIn){
        let productData = await productModel.find().populate('category').lean();
        console.log(productData, 'adminviewproduct 1')
        res.render('admin/view-product',{layout:'admin-layout',admin:true,productData})
       }
       else{
        res.redirect('/admin')
       }
    },
    adminLogout:(req,res)=>{
        req.session.admin = null;
        req.session.adminLoggedIn = false;
        res.redirect('/admin')
    },
    addProduct:async(req,res)=>{
        if(req.session.adminLoggedIn){
            const categorydata = await categoryModel.find().lean()
            res.render('admin/add-product',{layout:"admin-layout",admin:true,categorydata})
        }
        else{
            res.redirect('/admin')
        }
    },
    postAddProduct:async(req,res)=>{
        console.log(req.body,'postaddproduct 0')
        const productnames = await productModel.findOne({name:req.body.name}).lean();
        if(productnames){
            res.send('product already exists')
        }
        else{
            console.log(req.files,'post add product1')
            const arrImages = req.files.map((value)=> value.filename)
            console.log(arrImages,'postaddproduct 2')
            req.body.image = arrImages;
            console.log(req.body)
            await productModel.create(req.body);
            res.redirect('/admin/viewProduct')
        }
    },
    addCategory:(req,res)=>{
        if(req.session.adminLoggedIn){
            res.render('admin/add-category',{layout:"admin-layout",admin:true})
        }
        else{
            res.redirect('/admin')
        }
    },
    postAddCategory: async (req,res)=>{
        console.log(req.body.category,'postAddcategory 1')
       let categoryExist = await categoryModel.findOne({category:req.body.category}).lean()
       if(categoryExist){
         res.send('category already exists')
       }
       else{
         await categoryModel.create(req.body)
         res.redirect("/admin/viewProduct")
       }
    },
    updateProduct:(req,res)=>{
        if(req.session.adminLoggedIn){
            res.render('admin/update-product',{layout:"admin-layout",admin:true})
        }
        else{
            res.redirect('/admin')
        }
    }
}