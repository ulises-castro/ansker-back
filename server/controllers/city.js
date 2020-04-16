// TODO: Refactor this and create its controller to keep dry code
//Get cities by name
const getCity  = (req, res) => {

  let {
    city
  } = req.params
  city = city.toLowerCase()
  // return console.log(req.params)

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

  // cities = cities.sort((a, b) => {
  //   if (a.country === 'MX' && b.country !== 'MX')
  //     return -1
  //   else if (a.country !== 'MX' && b.country === 'MX')
  //     return 1
  //   else
  //     return 0
  // })

  cities = cities.slice(0, 5)

  return res.status(200).json({
    cities,
  })
}

export {
  getCity
}
