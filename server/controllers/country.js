const allCities = require('all-the-cities-mongodb')
let countries = require('country-data').countries


// TODO: Returning countries
const getCountry = (req, res) => {
  // const allContries = countries.all
  const countries = [
    countries.MX,
  ]

  return res.status(200).json({
    cities,
  })
}

//Get cities by name
const getCity  = (req, res) => {
  let {
    city
  } = req.params

  const userCountry = req.headers['CF-IPCountry'] || false

  city = city.toLowerCase()

  let cities = allCities.filter(cityCurrent => {
    if (
      cityCurrent.name.toLowerCase().match(city)
    ) {
      const countryData = countries[cityCurrent.country]
      cityCurrent.countryName = countryData.name
      cityCurrent.flag = countryData.emoji
      return cityCurrent
    }
  })

  cities = cities.sort((a, b) => {
    if (a.population > b.population)
      return -1
    else if (b.population > a.population)
      return 1
    else
      return 0
  })

  if (userCountry) {
    cities = cities.sort((a, b) => {
      if (a.country === userCountry && b.country !== userCountry)
        return -1
      else if (a.country !== userCountry && b.country === userCountry)
        return 1
      else
        return 0
    })
  }

  cities = cities.slice(0, 5)

  return res.status(200).json({
    cities,
  })
}

export {
  getCity,
  getCountry
}
