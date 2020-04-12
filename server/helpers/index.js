import axios from 'axios'

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}

export const distanceInKm = function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371

  var dLat = degreesToRadians(lat2 - lat1)
  var dLon = degreesToRadians(lon2 - lon1)

  lat1 = degreesToRadians(lat1)
  lat2 = degreesToRadians(lat2)

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (earthRadiusKm * c * 1000)
}

export function sendTelegramMsg(msg) {
  axios.get(`https://api.telegram.org/bot'
  ${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=183061705&text=${msg}`)
}