var dbcon = require("../server");
var base64 = require("base-64");
var md5 = require("md5");
const { check, validationResult } = require("express-validator");

module.exports = {
  // userRegistration: (req, res) => {
  //     console.log("add user successfully")
  //     let formData = req.body;

  //     let insertPostQuery =
  //         "INSERT INTO users SET first_name='" +
  //         formData.first_name +
  //         "', last_name='" +
  //         formData.last_name +
  //         "', email='" +
  //         formData.email +
  //         "', phone='" +
  //         formData.phone +
  //         "', password='" +
  //         md5(base64.encode(formData.password)) +
  //         "',status= '1',user_type='0'";
  //     dbcon.db.query(insertPostQuery, (err, existrec) => {
  //         if (err) {
  //             return res.status(500).send(err);
  //         }
  //         var lastinsertid = existrec.insertId;
  //         res.json({
  //             status: 1,
  //             message: "successfully inserted",
  //             post_id: lastinsertid
  //         });
  //     });
  // },

  userRegistration: (req, res) => {
    const errors = validationResult(req);
    const formData = req.body;
    let userchkSql =
      "SELECT * FROM `users1` WHERE email = '" + formData.email + "'";
    dbcon.db.query(userchkSql, (err, chkresult) => {
      if (err) {
        res.send(err);
      }
      if (chkresult.length === 0) {
        let usernamechkSql =
          "SELECT * FROM `users1` WHERE username = '" + formData.username + "'";
        dbcon.db.query(usernamechkSql, (err, usernamechkresult) => {
          if (err) {
            return res.status(500).send(err);
          }
          if (usernamechkresult.length === 0) {
            var verficationcode = md5(base64.encode(formData.email));

            let userinsertSql =
              "INSERT INTO `users1` SET `username` = '" +
              formData.username +
              "',`email` = '" +
              formData.email +
              "', `password` = '" +
              md5(base64.encode(formData.pass)) +
              "', login_type ='0', admin_verify = '1', user_verification_code = '" +
              verficationcode +
              "' ";

            dbcon.db.query(userinsertSql, (err, insertrec) => {
              if (err) {
                return res.status(500).send(err);
              }
              var lastinsertid = insertrec.insertId;

              let userdatainsertsql =
                "INSERT INTO `user_details` SET user_id = '" +
                lastinsertid +
                "', first_name = '" +
                formData.first_name +
                "', last_name = '" +
                formData.last_name +
                "',displayname='" +
                formData.username +
                "'";
              dbcon.db.query(userdatainsertsql, (err, insertrec) => {
                if (err) {
                  return res.status(500).send(err);
                }

                var linkset = base64.encode(formData.email);
                var mailOptions = {
                  from: "Elearning <admin@lvinfosolution.com>",
                  to: formData.email,
                  subject: "Elearning App Activation Link",
                  html: `<head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width">
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                    <meta name="x-apple-disable-message-reformatting">
                                    <title></title>
                                
                                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
                                
                                    <style>
                                        html,
                                        body {
                                            font-family: 'Roboto', sans-serif;
                                            margin: 0 auto !important;
                                            padding: 0 !important;
                                            height: 100% !important;
                                            width: 100% !important;
                                            background: #f1f1f1;
                                        }
                                        
                                        * {
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                        }
                                        
                                        div[style*="margin: 16px 0"] {
                                            margin: 0 !important;
                                        }
                                        
                                        table,
                                        td {
                                            mso-table-lspace: 0pt !important;
                                            mso-table-rspace: 0pt !important;
                                        }
                                        
                                        table {
                                            border-spacing: 0 !important;
                                            border-collapse: collapse !important;
                                            table-layout: fixed !important;
                                            margin: 0 auto !important;
                                        }
                                        
                                        img {
                                            -ms-interpolation-mode: bicubic;
                                        }
                                        
                                        a {
                                            text-decoration: none;
                                        }
                                        
                                        *[x-apple-data-detectors],
                                        .unstyle-auto-detected-links *,
                                        .aBn {
                                            border-bottom: 0 !important;
                                            cursor: default !important;
                                            color: inherit !important;
                                            text-decoration: none !important;
                                            font-size: inherit !important;
                                            font-family: inherit !important;
                                            font-weight: inherit !important;
                                            line-height: inherit !important;
                                        }
                                        
                                        .a6S {
                                            display: none !important;
                                            opacity: 0.01 !important;
                                        }
                                        
                                        .im {
                                            color: inherit !important;
                                        }
                                        
                                        img.g-img + div {
                                            display: none !important;
                                        }
                                        
                                        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                                            u ~ div .email-container {
                                                min-width: 320px !important;
                                            }
                                        }
                                        
                                        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                                            u ~ div .email-container {
                                                min-width: 375px !important;
                                            }
                                        }
                                        
                                        @media only screen and (min-device-width: 414px) {
                                            u ~ div .email-container {
                                                min-width: 414px !important;
                                            }
                                        }
                                    </style>
                                
                                    <style>
                                        .primary {
                                            background: #f3a333;
                                        }
                                        
                                        .bg_white {
                                            background: #ffffff;
                                        }
                                        
                                        .bg_light {
                                            background: #fafafa;
                                        }
                                        
                                        .bg_black {
                                            background: #000000;
                                        }
                                        
                                        .bg_dark {
                                            background: rgba(0, 0, 0, .8);
                                        }
                                        
                                        .email-section {
                                            /*padding: 2.5em;*/
                                        }
                                        
                                        .btn {
                                            padding: 10px 15px;
                                        }
                                        
                                        .btn.btn-primary {
                                            border-radius: 0;
                                            background: #630c0d;
                                            color: #ffffff;
                                        }
                                        
                                        h1,
                                        h2,
                                        h3,
                                        h4,
                                        h5,
                                        h6 {
                                            font-family: 'Playfair Display', serif;
                                            color: #000000;
                                            margin-top: 0;
                                        }
                                        
                                        body {
                                            font-family: 'Montserrat', sans-serif;
                                            font-weight: 400;
                                            font-size: 15px;
                                            line-height: 1.8;
                                            color: rgba(0, 0, 0, .4);
                                        }
                                        
                                        a {
                                            color: #89b947;
                                        }
                                        
                                        table {}
                                        /*LOGO*/
                                        
                                        .logo h1 {
                                            margin: 0;
                                        }
                                        
                                        .logo h1 a {
                                            color: #000;
                                            font-size: 20px;
                                            font-weight: 700;
                                            text-transform: uppercase;
                                            font-family: 'Montserrat', sans-serif;
                                        }
                                        
                                        .hero {
                                            position: relative;
                                        }
                                        
                                        .hero img {}
                                        
                                        .hero .text {
                                            color: rgba(255, 255, 255, .8);
                                        }
                                        
                                        .hero .text h2 {
                                            color: #ffffff;
                                            font-size: 26px;
                                            margin-bottom: 0;
                                            line-height:30px;
                                        }
                                        
                                        .heading-section {}
                                        
                                        .heading-section h2 {
                                            color: #000000;
                                            font-size: 28px;
                                            margin-top: 0;
                                            line-height: 1.4;
                                        }
                                        
                                        .heading-section .subheading {
                                            margin-bottom: 20px !important;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-transform: uppercase;
                                            letter-spacing: 2px;
                                            color: rgb(99, 12, 13);
                                            position: relative;
                                        }
                                        
                                        .heading-section .subheading::after {
                                            position: absolute;
                                            left: 0;
                                            right: 0;
                                            bottom: -10px;
                                            content: '';
                                            width: 100%;
                                            height: 2px;
                                            background: #630c0d;
                                            margin: 0 auto;
                                        }
                                        
                                        .heading-section-white {
                                            color: rgba(255, 255, 255, .8);
                                        }
                                        
                                        .heading-section-white h2 {
                                            font-size: 28px;
                                            font-family: line-height: 1;
                                            padding-bottom: 0;
                                        }
                                        
                                        .heading-section-white h2 {
                                            color: #ffffff;
                                        }
                                        
                                        .heading-section-white .subheading {
                                            margin-bottom: 0;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-transform: uppercase;
                                            letter-spacing: 2px;
                                            color: rgba(255, 255, 255, .4);
                                        }
                                        
                                        .icon {
                                            text-align: center;
                                        }
                                        
                                        .icon img {}
                                        
                                        .text-services {
                                            padding: 10px 10px 0;
                                            text-align: center;
                                        }
                                        
                                        .text-services h3 {
                                            font-size: 20px;
                                        }
                                        
                                        .text-services .meta {
                                            text-transform: uppercase;
                                            font-size: 14px;
                                        }
                                        
                                        .text-testimony .name {
                                            margin: 0;
                                        }
                                        
                                        .text-testimony .position {
                                            color: rgba(0, 0, 0, .3);
                                        }
                                        
                                        .img {
                                            width: 100%;
                                            height: auto;
                                            position: relative;
                                        }
                                        
                                        .img .icon {
                                            position: absolute;
                                            top: 50%;
                                            left: 0;
                                            right: 0;
                                            bottom: 0;
                                            margin-top: -25px;
                                        }
                                        
                                        .img .icon a {
                                            display: block;
                                            width: 60px;
                                            position: absolute;
                                            top: 0;
                                            left: 50%;
                                            margin-left: -25px;
                                        }
                                        
                                        .counter-text {
                                            text-align: center;
                                        }
                                        
                                        .counter-text .num {
                                            display: block;
                                            color: #ffffff;
                                            font-size: 34px;
                                            font-weight: 700;
                                        }
                                        
                                        .counter-text .name {
                                            display: block;
                                            color: rgba(255, 255, 255, .9);
                                            font-size: 13px;
                                        }
                                        
                                        .footer {
                                            color: rgba(255, 255, 255, .5);
                                        }
                                        
                                        .footer .heading {
                                            color: #ffffff;
                                            font-size: 20px;
                                        }
                                        
                                        .footer ul {
                                            margin: 0;
                                            padding: 0;
                                        }
                                        
                                        .footer ul li {
                                            list-style: none;
                                            margin-bottom: 10px;
                                        }
                                        
                                        .footer ul li a {
                                            color: rgba(255, 255, 255, 1);
                                        }
                                        
                                        @media screen and (max-width: 500px) {
                                            .icon {
                                                text-align: left;
                                            }
                                            .text-services {
                                                padding-left: 0;
                                                padding-right: 20px;
                                                text-align: left;
                                            }
                                        }
                                    </style>
                                </head>
                                
                                <body width="100%" style="background:#fff; margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
                                    <center style="width: 100%; background-color: #f1f1f1;">
                                        <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                                            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                                        </div>
                                        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                                            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                                                <tr>
                                                    <td class="bg_white logo" style="padding: 1em 2.5em 0; text-align: center">
                                                        <h1><a href="#"><img src="https://elearning.lvinfosolution.com/app-property/images/elogo.png" alt="" style="width:210px"></a></h1>
                                                    </td>
                                                </tr>
                                                <tr style="background:#fff;">
                                                    <td valign="middle" class="hero" style="background:#1b1b1b;  border-radius:30px 30px 0 0;"> 
                                                            <table align="center">
                                                                <tr>
                                                                    <td>
                                                                        <div class="text" style="padding:0; text-align: center;">
                                                                            <h2 style="font-weight:bold; color: #ffffff; font-size: 26px; line-height: 30px;">Welcome to E-Learning</h2>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="bg_white" style="text-align:left; width:100%; padding:20px 0;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding:0 20px; text-align:center;">
                                                                    <p style="color:#000; font-size:16px; margin:0 0 10px 0;"><strong><i>Its a Challenge</i></strong></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:0 20px; text-align:center;">
                                                                    <p style="color:#000; font-size:16px; margin:0 0 0px 0;"><strong>Click below to activate your account.</strong></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:10px 20px 20px; text-align:center;">
                                                                    <a href="http://glitcher.elvirainfotech.org/api/account-activate/${verficationcode}/${linkset}" style="display:inline-block; background:#161616; font-size:14px; line-height:16px; font-weight:bold; color:#f0de17;padding:8px 25px; border-radius:30px; ">ACTIVATE NOW</a>
                                                                </td>
                                                            </tr>
                                                            
                                                            <tr>
                                                                <td style="padding:0 20px;">
                                                                   
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr style="background:#fff;">
                                                    <td valign="middle" class="hero" style="background:#1b1b1b;  border-radius:0 0 30px 30px;">
                                                        <a href="#" style="display: block; padding:20px 0;">
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <div class="text" style="padding:0; text-align: center; height:20px;">
                                                                            
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </center>
                                </body>`,
                };
                let mail_res = "";
                dbcon.transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    mail_res = error;

                    console.log(error);
                  } else {
                    mail_res = info.response;
                    console.log("Email sent: " + info.response);
                  }
                });
                var userinsertid = insertrec.insertId;
                let getUserdetailQuery =
                  "SELECT * FROM user_details WHERE user_id=" + userinsertid;
                dbcon.db.query(getUserdetailQuery, (err, existrec) => {
                  if (err) throw err;
                  res.json({
                    status: "1",
                    message: "Data submmited successfully",
                    user: existrec[0],
                    mail_res: mail_res,
                  });
                });
                //res.json({ status: '1', message: 'Data submmited successfully' });
              });
            });
          } else {
            res.json({ status: "2", message: "Username already exists" });
          }
        });
      } else {
        res.json({ status: "2", message: "Email Id already exists" });
      }
    });
  },


  accountActive: (req, res) => {
    var code = req.params.activecode;
    var user = req.params.email;
    if ((code != '') && (user != "")) {
        var getemail = base64.decode(user);
        let checksql = "SELECT * from `users1` where email = '" + getemail + "' AND user_verification_code = '" + code + "' ";
        dbcon.db.query(checksql, (err, checkresult) => {
            if (err) throw err;
            if (checkresult.length > 0) {
                let updatever = "UPDATE `users1` set user_verification_code = NULL, status = '1' where email = '" + getemail + "' ";
                dbcon.db.query(updatever, (err, updres) => {
                    res.send("Account Successfully Activated");
                });
            } else {
                res.send('Sorry! Link is Expired...');
            }
        });
    } else {
        res.send('Sorry! Something went wrong...');
    }
},

  userLogin: (req, res) => {
    const errors = validationResult(req);
    const formData = req.body;
    let usersql =
      "SELECT u.* FROM `users` as u where u.email = '" +
      formData.email +
      "' AND u.user_type = '0' ";
    dbcon.db.query(usersql, (err, userresult) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (userresult.length == "1") {
        if (userresult[0].status == "1") {
          var inppass = md5(base64.encode(formData.password));
          if (inppass === userresult[0].password) {
            userresult[0].password = "";
            res.json({
              status: "1",
              userdetails: userresult,
              message: "Successfully Logged In",
            });
          } else {
            res.json({
              status: "2",
              message: "Email id or Password did not match",
            });
          }
        } else {
          res.json({
            status: "2",
            message:
              "Account temporarily disabled. Contact to Administrator or Check your mail to Activate your Account",
          });
        }
      } else {
        res.json({
          status: "2",
          message: "Sorry! you are not registered with us",
        });
      }
    });
  },

  clientLogin: (req, res) => {
    const errors = validationResult(req);
    const formData = req.body;
    let usersql =
      "SELECT u.* FROM `users` as u where u.email = '" +
      formData.email +
      "' AND u.user_type = '1' ";
    dbcon.db.query(usersql, (err, userresult) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (userresult.length == "1") {
        if (userresult[0].status == "1") {
          var inppass = md5(base64.encode(formData.password));
          if (inppass === userresult[0].password) {
            userresult[0].password = "";
            res.json({ status: "1", userdetails: userresult, message: "" });
          } else {
            res.json({
              status: "2",
              message: "Email id or Password did not match",
            });
          }
        } else {
          res.json({
            status: "2",
            message:
              "Account temporarily disabled. Contact to Administrator or Check your mail to Activate your Account",
          });
        }
      } else {
        res.json({
          status: "2",
          message: "Sorry! you are not registered with us",
        });
      }
    });
  },

  clientRegistration: (req, res) => {
    console.log("add client successfully");
    let formData = req.body;

    let insertPostQuery =
      "INSERT INTO users SET first_name='" +
      formData.first_name +
      "', last_name='" +
      formData.last_name +
      "', email='" +
      formData.email +
      "', phone='" +
      formData.phone +
      "', password='" +
      md5(base64.encode(formData.password)) +
      "',status= '1',user_type='1'";
    dbcon.db.query(insertPostQuery, (err, existrec) => {
      if (err) {
        return res.status(500).send(err);
      }
      var lastinsertid = existrec.insertId;
      res.json({
        status: 1,
        message: "successfully inserted",
        post_id: lastinsertid,
      });
    });
  },

  userLoginCheck: (req, res) => {
    const formData = req.body;
    let usersql =
      "SELECT u.* FROM `users` as u WHERE u.id = '" + formData.id + "'";
    dbcon.db.query(usersql, (err, userresult) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (userresult.length == "1") {
        res.json({ status: "1", user_details: userresult, message: "" });
      } else {
        res.json({
          status: "2",
          user_details: "",
          profile_status: "",
          preference_status: "",
          message: "Sorry! you are not registered with us",
        });
      }
    });
  },

  forgotPassword: (req, res) => {
    var postdata = req.body;
    let checkemail =
      "SELECT * FROM users1 where email = '" + postdata.email + "' limit 0,1";
    dbcon.db.query(checkemail, (err, checkresult) => {
      if (err) throw err;
      if (checkresult.length == 1) {
        if (checkresult[0].status == "1") {
          var randomcode = makeid(6);

          let forgetchecksql = "SELECR * FROM ";
        }
      }
    });
  },

  categoryList: (req, res) => {
    let allCategoryQuery = "SELECT * FROM `categories` LIMIT 6";
    dbcon.db.query(allCategoryQuery, (err, categories) => {
      if (categories.length > 0) {
        res.json({
          status: 1,
          categoryList: categories,
        });
      } else {
        res.json({
          status: 2,
          message: "Server Not Found",
        });
      }
    });
  },

  getCategoryBySlug: (req, res) => {
    const formData = req.params;
    let sql = "SELECT * FROM `services` WHERE slug='" + formData.slug + "'";
    dbcon.db.query(sql, (err, result) => {
      // console.log(sql);
      if (result.length > 0) {
        res.json({ status: "1", result: result });
      } else {
        res.json({ status: "2", message: "No Data Found" });
      }
    });
  },

  servicesList: (req, res) => {
    let allServiceQuery = "SELECT * FROM `services` LIMIT 6";
    dbcon.db.query(allServiceQuery, (err, services) => {
      if (services.length > 0) {
        res.json({
          status: 1,
          servicesList: services,
        });
      } else {
        res.json({
          status: 2,
          message: "Server Not Found",
        });
      }
    });
  },

  getServicesByCategory: (req, res) => {
    const formData = req.params;
    let sql =
      "SELECT s.*,c.* FROM `services` as s INNER JOIN `categories` as c ON s.cat_id = c.cat_id where s.cat_id=" +
      formData.id;
    // let sql = "SELECT * FROM `categories` WHERE parent_id='" + formData.id + "'";
    // let sql = "SELECT * FROM `services` WHERE cat-id='" + formData.id + "'";
    // console.log(sql);
    dbcon.db.query(sql, (err, result) => {
      // console.log(sql);
      console.log(result);
      if (result) {
        res.json({ status: "1", result: result });
      } else {
        res.json({ status: "2", message: "No Data Found" });
      }
    });
  },

  getServiceById: (req, res) => {
    const formData = req.params;
    let sql = "SELECT * FROM `services` WHERE sv_id='" + formData.id + "'";
    dbcon.db.query(sql, (err, result) => {
      if (result) {
        console.log(result);
        res.json({ status: "1", result: result });
      } else {
        res.json({ status: "2", message: "No Data Found" });
      }
    });
  },

  gcustomer_registration: (req, res) => {
    const errors = validationResult(req);
    // console.log("add challenge post")
    let formData = req.body;
    let userchkSql =
      "SELECT * FROM `users` WHERE email = '" + formData.email + "'";
    dbcon.db.query(userchkSql, (err, chkresult) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (chkresult.length === 0) {
        let userphonechkSql =
          "SELECT * FROM `users` WHERE phone ='" + formData.phone + "' ";
        dbcon.db.query(userphonechkSql, (err, userchkSql) => {
          if (err) {
            return res.status(500).send(err);
          }
          if (userchkSql.length === 0) {
            let userinsertSql =
              "INSERT INTO `users` SET `first_name`='" +
              formData.first_name +
              "',`last_name`='" +
              formData.last_name +
              "',`username` = '" +
              formData.username +
              "',`email` = '" +
              formData.email +
              "',`phone`='" +
              formData.phone +
              "', `password` = '" +
              md5(base64.encode(formData.password)) +
              "', user_type ='0', status = '1' ";
            dbcon.db.query(userinsertSql, (err, insertrec) => {
              if (err) {
                return res.status(500).send(err);
              }
              res.json({ status: "1", message: "Registration successfully" });
            });
          } else {
            res.json({ status: "2", message: "Phone number already exists" });
          }
        });
      } else {
        res.json({ status: "2", message: "Email already exists" });
      }
    });
  },

  addToCart: (req, res) => {
    console.log("add cart successfully");
    let formData = req.body;

    let insertPostQuery =
      "INSERT INTO carts SET sv_id='" +
      formData.sv_id +
      "',`user_id`='" +
      formData.small_id +
      "'";
    dbcon.db.query(insertPostQuery, (err, existrec) => {
      if (err) {
        return res.status(500).send(err);
      }
      var lastinsertid = existrec.insertId;
      res.json({
        status: 1,
        message: "Add to cart successfully",
        post_id: lastinsertid,
      });
    });
  },
};
