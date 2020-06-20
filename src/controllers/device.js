
import Device from 'models/device'

export async function registerDevice (req, res) {

}

export async function registerDeviceUser (req, res) {
  const deviceData = req.body.is

  deviceData.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  deviceData.browser = deviceData.name
  deviceData.userId = req.user._id
  deviceData.token = req.body.token

  const sendError = {
    success: false,
    message: 'Ocurrio un error, no pudimos procesar tu solicitud.'
  }

  const findDevice = await Device
  .findOne({ userId: deviceData.userId }).lean()

  if (findDevice) {
    return res.status(403).json(sendError)
  }

  const newDevice = new Device(deviceData)

  newDevice.save((err, device) => {
    if (err) {
      return res.status(403).json(sendError)
    }

    res.status(200).json({
      success: true
    })
  })

}
