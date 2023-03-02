const nodemailer = require("nodemailer");

module.exports={
 
  sendOTP:(email, otp)=> {
      return new Promise((resolve, reject)=>{
      let password="ezwnvgcnplgzdyex"
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "comicworld992@gmail.com",
            pass: password
        }
    });
    var mailOptions = {
        from:"comicworld992@gmail.com",
        to: email,
        subject: "Comic World Email verification",
        html: `
                  <h1>Verify Your Email For ComicWorld</h1>
                    <h3>use this code <h2>${otp}</h2> to verify your email</h3>
                   
                 `
    };
    transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
            console.log(err);
        }
        else {
          resolve(otp)
        }
    });
      })

  }
}

 

//  let Otp=Math.floor(Math.random()*1000000)
//  sendOTP("j9446244318@gmail.com",Otp).then(()=>{
//   console.log("email sent successfully");
//  }).catch(err=>{
//   console.log(err);
//   })