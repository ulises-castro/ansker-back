'use strict'

import { sendTelegramMsg } from 'helpers'

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
