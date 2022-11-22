var dbcon = require('../../server');
const { check, validationResult } = require('express-validator');
var base64 = require('base-64');
var md5 = require('md5');
var fs = require('fs');
var moment = require('moment');


module.exports = {
    addBlogPage: (req, res) => {
        var sess = req.session;
        if(sess.userid) {

            // let alluserQuery = "SELECT * FROM `users` as u INNER JOIN `user_details` as ud ON u.id = ud.user_id ORDER BY u.id DESC";
            let alluserQuery = "SELECT * FROM `users` WHERE user_type = '0' ORDER BY id DESC";

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

    
};