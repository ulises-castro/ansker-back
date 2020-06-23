'use strict'

import { sendTelegramMsg } from 'helpers'
import  html from 'helpers/email'

import User from 'models/user'

export const sendContactMessage = (req, res) => {
  const {
    message
  } = req.body

  try {
    sendTelegramMsg(`CONTACT MESSAGE: \n User - "${req.user._id}" \n ${message}`)

    res.status(200).json({
      success: true,
    })
  } catch {
    res.status(403).json({
      success: false,
      message: 'No se pudo enviar el mensaje, por favor intentalo de nuevo más tarde'
    })
  }
}

// const nodemailer = require("nodemailer")
// // async..await is not allowed in global scope, must use a wrapper
// export async function signupEmail() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount()

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'barney.schoen@ethereal.email',
//         pass: '7f327jQWUyhuJTtdfc'
//     }
//   })

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com,", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html
//   })

//   console.log("Message sent: %s", info.messageId)
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// signupEmail().catch(console.error)
