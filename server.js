const express = require('express')
const config = require("./config");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const { check, body, validationResult } = require("express-validator");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");
var cookieSession = require("cookie-session");
const fast2sms = require('fast-two-sms');
const client = require('twilio')(config.accountSID, config.authToken)
const cors=require("cors");
const app = express();
// const port = 4000

var http = require("http").Server(app);


// API Routes
const {
  userRegistration,
  accountActive,
  clientRegistration,
  userLogin,
  clientLogin,
  userLoginCheck,
  forgotPassword,
  categoryList,
  getCategoryBySlug,
  getServicesByCategory,
  getServiceById,
  servicesList,
  addToCart
}=require("./api/index");

const {
  viewProfile,
  gcustomer_registration,
  clientProfileImageUplaod,
  mobileOtp,
  login,
  userEdit,
  profileUpdate,
}=require("./api/users");


/*---------------------Admin routes method for the app Start--------------------------*/
const {
    getHomePage,
    getDashboard,
    getLogin,
    postLogin,
    postLogout,
    editProfilePage,
    editProfile,
    
}=require("./admin/router/index");

const {
    getAllUser,
    getAllVendors,
    getAllAppUser,
    userStatusChange,
    accStatusChange,
    
}=require("./admin/router/user");

const {
  addBlogPage
} = require("./admin/router/blog");

const {
  Category,
  addCategory,
  deleteCategory,
} = require("./admin/router/category");


const {
  Product,
  addProduct,
} = require("./admin/router/product");

const {
  Service,
  addService,
  deleteService
} = require("./admin/router/service");


const port = 4000;

app.set("views",__dirname + "/");
app.set("vew engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(
    cookieSession({
      name: "session",
      keys: ["keyboard cat"],
      // Cookie Options
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    })
  );

  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });

  
  const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(cors(corsOptions))
 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
app.use(cookieParser());

// configure express to use public folder for app front end
app.use("/app-property", express.static(path.join(__dirname, "public")));
// configure express to use public folder for app Admin
app.use(
  "/admin-property",
  express.static(path.join(__dirname, "admin/public"))
);
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Welcome to Elearning");
});


////// API Start ///////////
app.post("/api/registration",userRegistration);
app.get("/api/account-activate/:activecode/:email", accountActive);
app.post("/api/clientregister",clientRegistration);
app.post("/api/userlogin",userLogin);
app.post("/api/clientlogin",clientLogin);
app.post("/api/clientimageupload",clientProfileImageUplaod);
app.post("/api/usercheck",userLoginCheck);
app.post("/api/forgot-password",forgotPassword);

// Category

app.get("/api/categories",categoryList);
app.post("/api/get_details/:slug",getCategoryBySlug);
app.post("/api/get_services/:id",getServicesByCategory);
app.post("/api/get_services_by_id/:id",getServiceById);

//Service
app.get("/api/services",servicesList);


app.post("/api/add_to_cart",addToCart);

app.get("/api/send",mobileOtp);
app.get("/api/login",login);

app.get("/api/user/:id",userEdit);

app.post(
  "/api/profile-update",
  [check("id").not().isEmpty().withMessage("Userid missing")],
  profileUpdate
);

app.post("/api/viewprofile",viewProfile);
app.post("/api/gcustomer",gcustomer_registration);

// app.get('/amadeus',);

// Admin routes for the app Start
app.get("/admin", getHomePage);
app.get("/admin/dashboard", getDashboard);
app.get("/admin/login",getLogin);
app.post("/admin/login",postLogin);
app.post("/admin/logout",postLogout);
app.get("/admin/users",getAllUser);
app.get("/admin/vendors",getAllVendors);
app.get("/admin/appuser",getAllAppUser);
app.get("/admin/add-blog",addBlogPage);
app.get("/admin/edit-profile", editProfilePage);

app.post("/admin/accstatus",userStatusChange);
app.post("/admin/status",accStatusChange);
app.post("/admin/edit-profile",[
  check("name")
  .not()
  .isEmpty()
  .withMessage("Project Name should not be blank"),
  check("username")
  .not()
  .isEmpty()
  .withMessage("Username should not be blank")
  .isLength({min:4})
  .withMessage("Username Should be 4 Charecters")
  .custom((value)=>!/\s/.test(value))
  .withMessage("No spaces are allowed in the username"),
  check("email")
  .not()
  .isEmpty()
  .withMessage("Email Id should not be blank")
  .isEmail()
  .withMessage("Enter Valid Email Address"),
  check("phone")
  .not()
  .isEmpty()
  .withMessage("Phone Number Should not be Blank"),
],editProfile);


//admin category routes

app.get("/admin/categories",Category);
app.post("/admin/addcategory",addCategory);
app.get("/admin/delete-category/:id", deleteCategory);


//admin product routes

app.get("/admin/products",Product);
app.post("/admin/create_products",addProduct);

//admin product routes

app.get("/admin/services",Service);
app.post("/admin/create_service",addService);
app.get("/admin/delete-service/:id", deleteService);



const dbcon = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'elearning',
    debug    :  false
  });

// const dbcon = mysql.createPool({
//   connectionLimit : 100, //important
//   host     : 'localhost',
//   user     : 'odjmvakn_elearning',
//   password : '&r[xr$n~G*d_',
//   database : 'odjmvakn_elearning',
//   debug    :  false
// });
  

  // var transporter = nodemailer.createTransport({
  //   service: "smtp.gmail.com",
  //   host: "mail.lvinfosolution.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: "_mainaccount@lvinfosolution.com",
  //     pass: "fA7iK*9m2V74#j#",
  //   },
  // });

  // var transporter = nodemailer.createTransport({
  //   service: "smtp.gmail.com",
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: true,
  //   auth: {
  //     user: "marquise.tillman35@ethereal.email",
  //     pass: "d9ZDhkV5g4gsdd8QFv",
  //   },
  // });

  // let transporter = nodemailer.createTransport({
  //   service: 'smtp.gmail.com',
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   auth: {
  //     user: "marquise.tillman35@ethereal.email",
  //     pass: "d9ZDhkV5g4gsdd8QFv" 
  //   }
  // });

  
  let transporter = nodemailer.createTransport({
    service: 'mail.lvinfosolution.com',
    host: "mail.lvinfosolution.com",
    port: 465,
    auth: {
      user: "admin@lvinfosolution.com",
      pass: "Nandita2013@" 
    }
  });


  http.listen(port, () => {
    console.log(`Server running on port: http://localhost:${port}`);
  });

  module.exports.db = dbcon;
  module.exports.transporter = transporter;