const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  console.log("Options:", options);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: 'nlxp sxzp rglk jehe'
    }
 })

 const mailOptions =  {
    from:process.env.USER_EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text
  };
  console.log(mailOptions,"mailOptions");
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendEmail;