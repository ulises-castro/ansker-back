
import Device from 'models/device'

export async function registerDevice (req, res) {

}


export async function registerDeviceUser (req, res) {
  const deviceData = req.body.is

  deviceData.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  deviceData.browser = deviceData.name
  deviceData.userId = req.user._id

  const newDevice = new Device(deviceData)

  newDevice.save((err) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Ocurrio un error, no pudimos procesar tu solicitud.'
      })
    }

    res.status(200).json({
      success: true,
    })
  })

}
