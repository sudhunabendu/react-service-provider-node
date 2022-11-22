let transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
    // host: "smtp.ethereal.email",
    // port: 587,
    auth: {
      user: "adi2323basu@gmail.com",
      pass: "Ilovemymom&su" 
    }
  });


  const options ={
      from:"adi2323basu@gmail.com",
      to:"nabendubose1991@gmail.com",
      subject:"Sending Mail using Nodejs",
      text:"Wow Thats Greate",
  };

transporter.sendMail(options, function(err, info){
    if(err){
        console.log(err);
        return;
    }
    console.log("Send" + info.response);
})