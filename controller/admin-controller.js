const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const adminModel = require("../model/adminSchema");
const categoryModel = require("../model/categorySchema");
const productModel = require("../model/productSchema");
const userModel = require("../model/userSchema");
const cartModel = require("../model/cartSchema");
const orderModel = require("../model/orderSchema");
const { response } = require("../app");
const fs = require("fs");
const path = require("path");

module.exports = {
  adminSignupPage: (req, res, next) => {
    try {
      res.render("admin/signup", { layout: "admin-layout" });
    } catch (error) {
      next(error);
    }
  },
  adminLoginPage: (req, res, next) => {
    try {
      if (req.session.adminLoggedIn) {
        res.redirect("/admin/viewProduct");
      } else {
        res.render("admin/adminLogin", { layout: "admin-layout" });
      }
    } catch (error) {
      next(error);
    }
  },
  adminSignup: async (req, res, next) => {
    try {
      let adminexist = await adminModel.findOne({ email: req.body.email });
      if (adminexist) {
        res.send("admin already exist");
      } else {
        let newadmin = await adminModel.create(req.body);

        res.redirect("/admin");
      }
    } catch (error) {
      next(error);
    }
  },
  adminLogin: async (req, res, next) => {
    try {
      let currentadmin = await adminModel.findOne({ email: req.body.email });
      if (currentadmin) {
        let adminTrue = await bcrypt.compare(
          req.body.password,
          currentadmin.password
        );

        if (adminTrue) {
          req.session.admin = currentadmin;

          req.session.adminLoggedIn = true;

          res.redirect("/admin/viewProduct");
        }
      } else {
        res.send("admin does not exist");
      }
    } catch (error) {
      next(error);
    }
  },
  adminViewProduct: async (req, res, next) => {
    try {
      let productData = await productModel.find().populate("category").lean();

      currentAdmin = req.session.admin;
      res.render("admin/view-product", {
        layout: "admin-layout",
        admin: true,
        productData,
        currentAdmin,
      });
    } catch (error) {
      next(error);
    }
  },
  adminLogout: (req, res, next) => {
    try {
      req.session.admin = null;
      req.session.adminLoggedIn = false;
      res.redirect("/admin");
    } catch (error) {
      next(error);
    }
  },
  addProduct: async (req, res, next) => {
    try {
      const categorydata = await categoryModel.find().lean();
      res.render("admin/add-product", {
        layout: "admin-layout",
        admin: true,
        categorydata,
        currentAdmin: req.session.admin,
      });
    } catch (error) {
      next(error);
    }
  },
  postAddProduct: async (req, res, next) => {
    try {
      const productnames = await productModel
        .findOne({ name: req.body.name })
        .lean();
      if (productnames) {
        res.send("product already exists");
      } else {
        const arrImages = req.files.map((value) => value.filename);

        req.body.image = arrImages;

        await productModel.create(req.body);
        res.redirect("/admin/viewProduct");
      }
    } catch (error) {
      next(error);
    }
  },
  addCategory: async (req, res, next) => {
    try {
      let categoryData = await categoryModel.find().lean();

      res.render("admin/add-category", {
        layout: "admin-layout",
        admin: true,
        currentAdmin: req.session.admin,
        categoryData,
      });
    } catch (error) {
      next(error);
    }
  },
  postAddCategory: async (req, res, next) => {
    try {
      let categoryExist = await categoryModel
        .findOne({ category: req.body.category })
        .lean();
      if (categoryExist) {
        res.send("category already exists");
      } else {
        await categoryModel.create(req.body);
        res.redirect("/admin/addCategory");
      }
    } catch (error) {
      next(error);
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      await categoryModel.deleteOne({ _id: req.body.categoryId });
      res.json({ categoryDeleted: true });
    } catch (error) {
      next(error);
    }
  },
  editCategory: async (req, res, next) => {
    try {
      let category = await categoryModel.findOne({ _id: req.params.id }).lean();

      res.json({ category });
    } catch (error) {
      next(error);
    }
  },
  postEditCategory: async (req, res, next) => {
    try {
      await categoryModel.updateOne(
        { _id: req.params.id },
        {
          $set: { category: req.body.category },
        }
      );
      res.redirect("/admin/addCategory");
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      let productId = req.params.id;
      let productData = await productModel
        .findOne({ _id: productId })
        .populate("category")
        .lean();
      let categoryData = await categoryModel.find().lean();

      res.render("admin/update-product", {
        layout: "admin-layout",
        admin: true,
        currentAdmin: req.session.admin,
        productData,
        categoryData,
      });
    } catch (error) {
      next(error);
    }
  },
  postUpdateProduct: async (req, res, next) => {
    try {
      if (req.files[0]) {
        let imagepat = await productModel
          .findOne({ _id: req.params.id }, { image: 1, _id: 0 })
          .lean();
        imagepat.image.map((i) =>
          fs.unlinkSync(
            path.join(__dirname, "..", "public", "product_uploads", i)
          )
        );
        const arrImages = req.files.map((value) => value.filename);
        req.body.image = arrImages;
        await productModel.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: req.body.name,
              brandName: req.body.brandName,
              category: req.body.category,
              description: req.body.description,
              stock: req.body.stock,
              price: req.body.price,
              image: req.body.image,
            },
          }
        );
      } else {
        await productModel.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: req.body.name,
              brandName: req.body.brandName,
              category: req.body.category,
              description: req.body.description,
              stock: req.body.stock,
              price: req.body.price,
            },
          }
        );
      }
      res.redirect("/admin/viewProduct");
    } catch (error) {
      next(error);
    }
  },
  viewUser: async (req, res, next) => {
    try {
      let userData = await userModel.find().lean();

      res.render("admin/view-user", {
        layout: "admin-layout",
        admin: true,
        userData,
        currentAdmin: req.session.admin,
      });
    } catch (error) {
      next(error);
    }
  },
  blockUnblockUser: async (req, res, next) => {
    try {
      let userData = await userModel.findOne({ _id: req.params.id }).lean();

      if (userData.status) {
        await userModel.updateOne(
          { _id: req.params.id },
          { $set: { status: false } }
        );
      } else {
        await userModel.updateOne(
          { _id: req.params.id },
          { $set: { status: true } }
        );
      }
      res.redirect("/admin/viewUser");
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      let imagepat = await productModel
        .findOne({ _id: req.params.id }, { image: 1, _id: 0 })
        .lean();
      imagepat.image.map((i) =>
        fs.unlinkSync(
          path.join(__dirname, "..", "public", "product_uploads", i)
        )
      );
      await productModel.deleteOne({ _id: req.params.id });
      res.redirect("/admin/viewProduct");
    } catch (error) {
      next(error);
    }
  },
  viewOrders: async (req, res, next) => {
    try {
      let orderData = await orderModel.find().populate("userId").lean();
      res.render("admin/viewOrders", {
        layout: "admin-layout",
        admin: true,
        currentAdmin: req.session.admin,
        orderData,
      });
    } catch (error) {
      next(error);
    }
  },
  postEditStat: async (req, res, next) => {
    try {
      let status = await orderModel.updateOne(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } }
      );
      let newstatus = await orderModel
        .findOne({ _id: req.body.orderId })
        .lean();

      if (status.acknowledged) {
        res.json({ status: true });
      }
    } catch (error) {
      next(error);
    }
  },
  renderDashboard: async (req, res, next) => {
    try {
      res.render("admin/adminDashboard", {
        layout: "admin-layout",
        admin: true,
        currentAdmin: req.session.admin,
      });
    } catch (error) {
      next(error);
    }
  },
  graphData: async (req, res, next) => {
    try {
      const eachDaySale = await orderModel
        .aggregate([
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              total: { $sum: "$grandTotal" },
            },
          },
        ])
        .sort({ _id: -1 });

      const monthlySales = await orderModel
        .aggregate([
          {
            $group: {
              _id: { month: { $month: "$createdAt" } },
              total: { $sum: "$grandTotal" },
            },
          },
        ])
        .sort({ _id: -1 });
      const paymentType = await orderModel
        .aggregate([
          {
            $group: {
              _id: { paymentType: "$paymentMethod" },
              total: { $sum: "$grandTotal" },
            },
          },
        ])
        .sort({ paymentMethod: 1 });

      graphData = { paymentType, monthlySales, eachDaySale };
      let paymentTotal = [];
      let monthlyTotal = [];
      paymentTotal[0] = paymentType[0].total;
      paymentTotal[1] = paymentType[1].total;
      let total;

      for (i = 0; i <= 11; i++) {
        total = 0;
        for (j = 0; j <= monthlySales.length - 1; j++) {
          if (monthlySales[j]._id.month == i + 1)
            total = total + monthlySales[j].total;
        }
        monthlyTotal[i] = total;
      }

      res.json({ message: "success", paymentTotal, monthlyTotal });
    } catch (error) {
      next(error);
    }
  },
};
