const nodemailer = require("nodemailer")
const asyncHandler = require("express-async-handler")
// Configuration du transporteur SMTP
const sendEmail = asyncHandler(async(data,req,res)=>
{
    let transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // false pour les connexions non sécurisées
        auth: {
          user: 'abassiabir060@gmail.com',
          pass: process.env.SMTP_PASS,
        },
      
      });


 let info = await transporter.sendMail({
    from:'"Hey👋" sannyshop@gmail.com',
    to:data.to,
    subject:data.subject,
    text:data.text,
    html:data.htm,

 })
  console.log("message sent %s",info.messageId);

  console.log("Preview URL %s",nodemailer.getTestMessageUrl(info));
})

module.exports=sendEmail;
