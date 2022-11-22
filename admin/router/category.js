var dbcon = require('../../server');
const { check, validationResult } = require('express-validator');
var base64 = require('base-64');
var md5 = require('md5');
var fs = require('fs');
var moment = require('moment');


module.exports = {
    Category: (req, res)=>{
        const sess = req.session;
        if(sess.userid){
            let sqlCategory = "SELECT * FROM `categories`";
            dbcon.db.query(sqlCategory,(err, sqlResult)=>{
                console.log(sqlResult);
                if(err){
                    return res.status(500).send(err);
                }
                res.render("admin/manage-categories.ejs",{
                    title:"Manage Categoy",
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
    addCategory: (req, res) => {
        var sess = req.session;
        const errors = validationResult(req);
        var formData = req.body;
        var date = new Date(formData.start_date); // Now
        date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
        var end_date = moment(date).format( 'YYYY-MM-DD');
        if (sess.userid) {
          if (!errors.isEmpty()) {
            res.render("admin/manage-categories.ejs", {
              title: "Add New Category",
              type: "add",
              page: "addcategory",
              error: errors.mapped(),
              formdata: formData,
              sessionvalue: sess,
            });
         
              } else {
               //////////// Upload Image Start //////////
               if (req.files && Object.keys(req.files).length !== 0) {
                if (req.files.img) {
                  let uploadedFile = req.files.img;
                  var image_name = uploadedFile.name;
                  let filenameSplit = image_name.split(".");
                  let fileExtension = filenameSplit[filenameSplit.length - 1];
                  image_name = "category" + "_" + Date.now() + "." + fileExtension;
                  uploadedFile.mv(
                    "public/images/uploads/category/" + image_name,
                    (err) => {
                      if (err) {
                        return res.status(500).send(err);
                      }
                    }
                  );
                }
              }
              //////////// Upload Image End //////////
    
                 let insertQuery ="INSERT INTO `categories` SET cat_name = " + (formData.cat_name != "" ? "'" + formData.cat_name + "'" : "NULL") + ", slug = " + (formData.slug != "" ? "'" + formData.slug + "'" : "NULL") + ", description = " + (formData.description != "" ? "'" + formData.description + "'" : "NULL") + ", parent_id = " + (formData.parent_id != "" ? "'" + formData.parent_id + "'" : "NULL") + ", img = " + (formData.img != "" ? "'" + image_name + "'" : "NULL") + " " + " ";
                dbcon.db.query(insertQuery, (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  } else {
                    res.redirect("/admin/categories");
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
};