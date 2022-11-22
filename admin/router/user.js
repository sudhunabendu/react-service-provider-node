var dbcon = require('../../server');
const { check, validationResult } = require('express-validator');
var base64 = require('base-64');
var md5 = require('md5');
var fs = require('fs');
var moment = require('moment');


module.exports = {
    getAllUser: (req, res) => {
        var sess = req.session;
        if(sess.userid) {
            // let alluserQuery = "SELECT * FROM `users` as u INNER JOIN `user_details` as ud ON u.id = ud.user_id ORDER BY u.id DESC";
            let alluserQuery = "SELECT * FROM `users` WHERE user_type = '1' ORDER BY id DESC";

            dbcon.db.query(alluserQuery, (err, result) => {
                console.log(result);
                if (err) {
                    return res.status(500).send(err);
                }
                res.render('admin/manage-users.ejs', {
                    title: 'Manage User',
                    type: 'allview',
                    page: 'customer',
                    userdetails: result,
                    usermeta: '',
                    moment: moment,
                    sessionvalue: sess
                });   
                
            });
        }else{
            res.redirect('/admin/login');
        }
    },

    getAllVendors: (req, res) => {
        var sess = req.session;
        if(sess.userid) {

            // let alluserQuery = "SELECT * FROM `users` as u INNER JOIN `user_details` as ud ON u.id = ud.user_id ORDER BY u.id DESC";
            let alluserQuery = "SELECT * FROM `users` WHERE user_type = '1' ORDER BY id DESC";

            dbcon.db.query(alluserQuery, (err, result) => {
                console.log(result);
                if (err) {
                    return res.status(500).send(err);
                }
                res.render('admin/manage-vendors.ejs', {
                    title: 'Manage Vendor',
                    type: 'allview',
                    page: 'customer',
                    userdetails: result,
                    usermeta: '',
                    moment: moment,
                    sessionvalue: sess
                });   
                
            });
        }else{
            res.redirect('/admin/login');
        }
    },

    getAllAppUser: (req, res) => {
        var sess = req.session;
        if(sess.userid) {

            let alluserQuery = "SELECT * FROM `users1` as u INNER JOIN `user_details` as ud ON u.id = ud.user_id ORDER BY u.id DESC";
            // let alluserQuery = "SELECT * FROM `users1` WHERE user_type = '0' ORDER BY id DESC";

            dbcon.db.query(alluserQuery, (err, result) => {
                console.log(result);
                if (err) {
                    return res.status(500).send(err);
                }
                res.render('admin/manage-appuser.ejs', {
                    title: 'Manage App User',
                    type: 'allview',
                    page: 'customer',
                    userdetails: result,
                    usermeta: '',
                    moment: moment,
                    sessionvalue: sess
                });   
                
            });
        }else{
            res.redirect('/admin/login');
        }
    },

    viewUser : (req, res) => {
        var sess = req.session;
        if(sess.userid) {
            let countryQry = "SELECT * from `users`";
            dbcon.db.query(countryQry, (err, countryresult) => {
                if(err) throw err;
                var requestid = req.params.id;
                let userDetailsQry = "SELECT ud.*,u.username,u.email,u.email_verification,u.status,u.create_time,u.id as user FROM `users` as u INNER JOIN `user_details` as ud ON u.id = ud.user_id WHERE u.id = '"+requestid+"' ";
                dbcon.db.query(userDetailsQry, (err, result) => {
                    if(err) throw err;
                    res.render('admin/manage-users.ejs', {
                        title: 'Edit User',
                        type: 'view',
                        page: 'editcustomer',
                        formdata : '',
                        userdata: result[0],
                        sessionvalue: sess
                    });
                });
            });
        }else{
            res.redirect('/admin/login');
        }
    },

    userStatusChange: (req, res) => { 
        var requestid = req.params.id;
        let statusUpdateQry="";
        if(requestid){
            statusUpdateQry = "UPDATE users SET status = '"+req.body.status+"' WHERE id = '"+req.body.id+"' ";
        }else{
            statusUpdateQry = "UPDATE users SET status = '"+req.body.status+"' WHERE id = '"+req.body.id+"' ";
        }
        console.log(statusUpdateQry);
        dbcon.db.query(statusUpdateQry, (err, rows)=>{
            if(err) throw err;
            if(rows.changedRows == '1')
            {
                res.send('success');
            }else{
                console.log(statusUpdateQry);
                res.send('error');
            }
        });
    },

    accStatusChange: (req, res) => { 
        var requestid = req.params.id;
        let statusUpdateQry="";
        if(requestid){
            statusUpdateQry = "UPDATE users SET acc_status = '"+req.body.acc_status+"' WHERE id = '"+req.body.id+"' ";
        }else{
            statusUpdateQry = "UPDATE users SET acc_status = '"+req.body.acc_status+"' WHERE id = '"+req.body.id+"' ";
        }
        console.log(statusUpdateQry);
        dbcon.db.query(statusUpdateQry, (err, rows)=>{
            if(err) throw err;
            if(rows.changedRows == '1')
            {
                res.send('success');
            }else{
                console.log(statusUpdateQry);
                res.send('error');
            }
        });
    },
    
};