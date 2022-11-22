var dbcon = require("../../server");
const { check, validationResult } = require("express-validator");
var base64 = require("base-64");
var md5 = require("md5");
var fs = require("fs");
const e = require("express");
const { encode } = require("punycode");

module.exports = {
  getHomePage: (req, res) => {
    res.render("admin/index.ejs", {
      title: "Welcome to Dashbboard",
    });
  },

  getDashboard: (req, res) => {
    var sess = req.session;
    if (sess.userid) {
      res.render("admin/index.ejs", {
        title: "Welcome to Dashbboard",
        page: "dashboard",
        sessionvalue: sess,
      });
    } else {
      res.redirect("/admin/login");
    }
  },

  postLogin: (req, res) => {
    var sess = req.session;
    const admin = req.body.admin;
    const username = req.body.username;
    const password = req.body.pass;
    var admintype = "";

    if (admin != "" && username !== "" && password != "") {
      if (admin == "super") {
        admintype = "1";
      } else if (admin == "stuff") {
        admintype = "2";
      } else if (admin == "others") {
        admintype = "3";
      }
      let sql = `SELECT * FROM admin_user where username = '${username}' AND admin_type = '${admintype}' `;

      dbcon.db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        var inppass = md5(base64.encode(password));
        if (rows.length == "1") {
          if (inppass === rows[0].password) {
            sess.userid = rows[0].id;
            sess.admin_type = rows[0].admin_type;
            sess.name = rows[0].name;
            res.send("success");
          } else {
            res.send("error");
          }
        } else {
          res.send("error");
        }
      });
    } else {
      res.send("error");
    }
  },

  getLogin: (req, res) => {
    var sess = req.session;
    if (sess.userid) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/login.ejs", {
        title: "Login Your Admin Panel",
        page: req.url,
      });
    }
  },

  postLogout: (req, res) => {
    req.session = null;
    res.send("success");
  },

  getAllUser: (req, res) => {},

  editProfilePage: (req, res) => {
    const sess = req.session;
    if (sess.userid) {
      let getSql = "SELECT * FROM admin_user WHERE id = '1'";
      dbcon.db.query(getSql, (err, getResult) => {
        res.render("admin/edit-profile.ejs", {
          title: "Edit Admin",
          page: "Edit Admin Page",
          error: req.query.error ? JSON.parse(req.query.error) : "",
          result: getResult[0],
          sessionvalue: sess,
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  },

  editProfile: (req, res) => {
    const sess = req.session;
    const errors = validationResult(req);
    const formData = req.body;
    if (sess.userid) {
      if (!errors.isEmpty()) {
        res.redirect(
          "/admin/edit-profile?error=" +
            encodeURIComponent(JSON.stringify(errors.mapped()))
        );
      } else {
        dbcon.db.query(
          "UPDATE `admin_user` SET name = " +
            (formData.name != "" ? "'" + formData.name + "'" : "NULL") +
            ", email = " +
            (formData.email != "" ? "'" + formData.email + "'" : "NULL") +
            ", username = " +
            (formData.username != "" ? "'" + formData.username + "'" : "NULL") +
            ", phone = " +
            (formData.phone != "" ? "'" + formData.phone + "'" : "NULL") +
            " WHERE id = '1'"
        );
        res.redirect("/admin/dashboard");
      }
    } else {
      res.redirect("/admin/login");
    }
  },
};
