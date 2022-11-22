var dbcon = require('../server');
var base64 = require('base-64');
var md5 = require('md5');
const { check, validationResult } = require('express-validator');
const fast2sms = require('fast-two-sms');
const config = require("../config")
const twilio = require('twilio');
const { accountSID, authToken } = require('../config');
const client = new twilio(accountSID,authToken)



var options ={
    authorization:"l0tknRFsgH7PNGSjuvLM2x6diqcK1UpTrDYZobAe8wVWOXfQ4B2Q0F1lvJnH4LkyZmTPOYIR7AXDx3ho",
    message:"This is otp code message your otp code is 5648",
    numbers:['9836056103']
}

module.exports = {
    viewProfile: (req, res) => {
        const formData = req.body;
        if (formData.userid != "") {
            let userdetQry = "SELECT ud.*, u.status from `users1` as u INNER JOIN `user_details` as ud ON u.id = ud.user_id WHERE u.id = '" + formData.userid + "' limit 0,1";
            dbcon.db.query(userdetQry, (err, userresult) => {
                if (err) {
                    return res.status(500).send(err);
                }
                console.log("profile status");
                if (userresult.length > 0) {
                    if (userresult[0].status == "1") {
                        res.json({
                            status: "1",
                            userdetails: userresult,
                            message: ""
                        });
                    } else {
                        res.json({
                            status: "2",
                            userdetails: userresult,
                            message: "Sorry! Acoount not active"
                        });
                    }
                } else {
                    res.json({
                        status: "2",
                        userdetails: "",
                        message: "Sorry! no data found",
                    });
                }
            });
        } else {
            res.json({
                status: "2",
                userdetails: "",
                message: "Sorry! something went wrong",
            });
        }
    },


    gcustomer_registration: (req, res) => {
        const errors = validationResult(req);
        // console.log("add challenge post")
        let formData = req.body;
        let userchkSql = "SELECT * FROM `users` WHERE email = '" + formData.email + "'";
        dbcon.db.query(userchkSql, (err, chkresult) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (chkresult.length === 0) {
                let userphonechkSql = "SELECT * FROM `users` WHERE phone ='" + formData.phone + "' ";
                dbcon.db.query(userphonechkSql, (err, userchkSql) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (userchkSql.length === 0) {
                        let userinsertSql = "INSERT INTO `users` SET `first_name`='" + formData.first_name + "',`last_name`='" + formData.last_name + "',`username` = '" + formData.username + "',`email` = '" + formData.email + "',`phone`='" + formData.phone + "', `password` = '" + md5(base64.encode(formData.password)) + "', user_type ='0', status = '1' ";
                        dbcon.db.query(userinsertSql, (err, insertrec) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.json({ status: '1', message: 'Registration successfully' });
                        });
                    } else {
                        res.json({ status: '2', message: 'Phone number already exists' });
                    }
                })
            } else {
                res.json({ status: '2', message: 'Email already exists' });
            }
        });
    },

    userEdit:(req, res)=>{
        var id =req.params.id;
        let sqpTeacher = `SELECT * FROM users WHERE id=${id} `;
        dbcon.db.query(sqpTeacher, (err, userDetails)=>{
            if(err){return res.status(500).send(err); }
            // res.render('./views/video.html',{video:videoresult[0]});
            res.status(200).send(userDetails)
        })
    },


    profileUpdate: (req, res) => {
        console.log("Profile Update")
        const formData = req.body;
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          res.json({
            status: "2",
            userid: formData.userid,
            message: errors.mapped(),
          });
        } else {
          var allfield = [];
          var newgenerate = "";
          for (var key in formData) {
            if (key != "id") {
              newgenerate =
                formData[key] != "" ? key + ' = ' + '"' + formData[key] + '"' : "";
              allfield.push(newgenerate);
            }
          }
          var allfield = allfield.filter(function (el) {
            return el != null && el != "";
          });
          var updatefields = allfield.join();
          console.log(updatefields);
    
          let updateQry =
            'UPDATE `users` SET ' +
            updatefields +
            ' WHERE id = "' +
            formData.userid +
            '" ';
          console.log(updateQry);
          dbcon.db.query(updateQry, (err, upresult) => {
            res.json({
              status: "1",
              userid: formData.userid,
              message: "Data updated successfully",
            });
          });
        }
      },




    clientProfileImageUplaod:(req,res)=>{
        console.log("Hello");
    },

    mobileOtp:(req,res)=>{
        fast2sms.sendMessage(options)
        .then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err);
        })
    },

    login:(req, res)=>{
        client.verify.services(config.serviceID).verifications.create({to:`+${req.query.phone}`, channel:req.query.channel})
        .then((data)=>{
            res.status(200).send(data)
        }).catch((data)=>{
            res.status(500).send(data)
        })
    }

}