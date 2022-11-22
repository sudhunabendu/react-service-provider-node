var dbcon = require('../../server');
const { check, validationResult } = require('express-validator');
var base64 = require('base-64');
var md5 = require('md5');
var fs = require('fs');
var moment = require('moment');


module.exports = {
    Product: (req, res)=>{
        const sess = req.session;
        if(sess.userid){
            //let sqlProduct = "SELECT * FROM `products`";
            let sqlProduct = "SELECT a.*,b.* FROM products a INNER JOIN categories b ON a.cat_id = b.cat_id;";
            
            let sqlCategory = "SELECT * FROM `categories`";
            dbcon.db.query(sqlProduct,(err, sqlResult)=>{
              dbcon.db.query(sqlCategory,(err,sqlCat)=>{
                console.log(sqlResult);
                if(err){
                    return res.status(500).send(err);
                }
                res.render("admin/manage-products.ejs",{
                    title:"Manage Product",
                    type:"",
                    page:"",
                    products:sqlResult,
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
    addProduct: (req, res) => {
        var sess = req.session;
        const errors = validationResult(req);
        var formData = req.body;
        var date = new Date(formData.start_date); // Now
        date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
        var end_date = moment(date).format( 'YYYY-MM-DD');
        if (sess.userid) {
          const categories = "SELECT * FROM categories";
          if (!errors.isEmpty()) {
            
            res.render("admin/manage-products.ejs", {
              title: "Add New Product",
              type: "add",
              page: "addproduct",
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
                  image_name = "product" + "_" + Date.now() + "." + fileExtension;
                  uploadedFile.mv(
                    "public/images/uploads/product/" + image_name,
                    (err) => {
                      if (err) {
                        return res.status(500).send(err);
                      }
                    }
                  );
                }
              }
              //////////// Upload Image End //////////
    
                 let insertQuery ="INSERT INTO `products` SET p_name = " +
                  (formData.p_name != "" ? "'" + formData.p_name + "'" : "NULL") + ", p_slug = " +
                  (formData.p_slug != "" ? "'" +formData.p_slug + "'" : "NULL") + ", p_desc = " +
                  (formData.p_desc != "" ? "'" + formData.p_desc + "'" : "NULL") + ", price = " +
                  (formData.price != "" ? "'" + formData.price + "'" : "NULL") + ", qty = " +
                  (formData.qty != "" ? "'" + formData.qty + "'" : "NULL") + ", color = " + 
                  (formData.color != "" ? "'" + formData.color + "'" : "NULL") + ", size = " + 
                  (formData.size != "" ? "'" + formData.size + "'" : "NULL") + ", cat_id = " + 
                  (formData.cat_id != "" ? "'" + formData.cat_id + "'" : "NULL") + ", image = " +
                  (formData.image != "" ? "'" + image_name + "'" : "NULL") + " " + " ";
                dbcon.db.query(insertQuery, (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  } else {
                    res.redirect("/admin/products");
                  }
                });
              }
          
        } else {
          res.redirect("/admin/login");
        }
      },

      deleteCategory: (req, res) => {
        var sess = req.session;
    
        if (sess.userid) {
          var requestid = req.params.id;
          console.log(requestid);
          let deleteCategoryQuery = "DELETE FROM categories WHERE cat_id=" + requestid + "";
          dbcon.db.query(deleteCategoryQuery, (err, result) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              res.redirect("/admin/categories");
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