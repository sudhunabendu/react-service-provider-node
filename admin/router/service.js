var dbcon = require('../../server');
const { check, validationResult } = require('express-validator');
var base64 = require('base-64');
var md5 = require('md5');
var fs = require('fs');
var moment = require('moment');


module.exports = {
    Service: (req, res)=>{
        const sess = req.session;
        if(sess.userid){
            //let sqlService = "SELECT * FROM `products`";
            let sqlService = "SELECT a.*,b.* FROM services a INNER JOIN categories b ON a.sv_id = b.cat_id;";
            let sqlCategory = "SELECT * FROM `categories`";
            dbcon.db.query(sqlService,(err, sqlResult)=>{
              dbcon.db.query(sqlCategory,(err,sqlCat)=>{
                console.log(sqlResult);
                if(err){
                    return res.status(500).send(err);
                }
                res.render("admin/manage-service.ejs",{
                    title:"Manage Service",
                    type:"",
                    page:"",
                    services:sqlResult,
                    categories:sqlCat,
                    moment:moment,
                    sessionvalue: sess
                });
              })
                
            });
            
        }else{
            res.redirect('/admin/login');
        }  
    },
    addService: (req, res) => {
        var sess = req.session;
        const errors = validationResult(req);
        var formData = req.body;
        var date = new Date(formData.start_date); // Now
        date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
        var end_date = moment(date).format( 'YYYY-MM-DD');
        if (sess.userid) {
          const categories = "SELECT * FROM categories";
          if (!errors.isEmpty()) {
            
            res.render("admin/manage-service.ejs", {
              title: "Add New Service",
              type: "add",
              page: "addservice",
              error: errors.mapped(),
              formdata: formData,
              sessionvalue: sess,
            });
         
              } else {
               //////////// Upload Image Start //////////
               if (req.files && Object.keys(req.files).length !== 0) {
                if (req.files.image) {
                  let uploadedFile = req.files.image;
                  var image_name = uploadedFile.name;
                  let filenameSplit = image_name.split(".");
                  let fileExtension = filenameSplit[filenameSplit.length - 1];
                  image_name = "services" + "_" + Date.now() + "." + fileExtension;
                  uploadedFile.mv(
                    "public/images/uploads/services/" + image_name,
                    (err) => {
                      if (err) {
                        return res.status(500).send(err);
                      }
                    }
                  );
                }
              }
              //////////// Upload Image End //////////
    
                 let insertQuery ="INSERT INTO `services` SET sv_name = " +
                  (formData.sv_name != "" ? "'" + formData.sv_name + "'" : "NULL") + ", sv_slug = " +
                  (formData.sv_slug != "" ? "'" +formData.sv_slug + "'" : "NULL") + ", sv_desc = " +
                  (formData.sv_desc != "" ? "'" + formData.sv_desc + "'" : "NULL") + ", price = " +
                  (formData.price != "" ? "'" + formData.price + "'" : "NULL") + ",cat_id = " + 
                  (formData.cat_id != "" ? "'" + formData.cat_id + "'" : "NULL") + ", image = " +
                  (formData.image != "" ? "'" + image_name + "'" : "NULL") + " " + " ";
                dbcon.db.query(insertQuery, (err, result) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                  } else {
                    res.redirect("/admin/services");
                  }
                });
              }
          
        } else {
          res.redirect("/admin/login");
        }
      },

      deleteService: (req, res) => {
        var sess = req.session;
    
        if (sess.userid) {
          var requestid = req.params.id;
          // console.log(requestid);
          let deleteServiceQuery = "DELETE FROM services WHERE sv_id=" + requestid + "";
          dbcon.db.query(deleteServiceQuery, (err, result) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              res.redirect("/admin/services");
            }
          });
        } else {
          res.redirect("/admin/login");
        }
      }, 
      
      Category: (req, res)=>{
        const sess = req.session;
        if(sess.userid){
            let sqlCategory = "SELECT * FROM `categories`";
            dbcon.db.query(sqlCategory,(err, sqlResult)=>{
                console.log(sqlResult);
                if(err){
                    return res.status(500).send(err);
                }
                res.render("admin/manage-product.ejs",{
                    title:"Manage Product",
                    type:"",
                    page:"",
                    categories:sqlResult,
                    moment:moment,
                    sessionvalue: sess
                });
            });
            
        }else{
            res.redirect('/admin/login');
        }  
    },
};