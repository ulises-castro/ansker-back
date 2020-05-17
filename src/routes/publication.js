const express = require('express')
const router = express.Router()

const passport = require('passport')

import { getAllByCity, getAll, getPublication, setLike, publish } from 'controllers/publication'

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}), publish)

router.get('/filter/:countryCode/:city/:pageNumber', passport.authenticate('jwt', {
  session: false,
}), getAllByCity)

router.get('/filter/all/:pageNumber', passport.authenticate('jwt', {
  session: false,
}), getAll)

router.post('/liked', passport.authenticate('jwt', {
  session: false,
}), setLike)

router.get('/:publicationId', passport.authenticate('jwt', {
  session: false,
}), getPublication)

module.exports = router

// TODO: Check if this is still useful for app's purpose
// router.post('/allByNearDistance', passport.authenticate('jwt', {
//   session: false,
// }),
// async function(req, res) {
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')

//   const {
//     Region,
//     City,
//     latitude,
//     longitude,
//     CountryCode,
//   } = req.body

//   const locationData = {
//     countryCode: CountryCode,
//     regionName: Region,
//     city: City,
//     location: {
//       type: 'Point',
//       coordinates: [Number(longitude), Number(latitude)],
//     }
//   }

//   // TODO: Using location to avoid make this request, CHECK THIS 
//   let updatedUser = await User
//     .updateUserLocation(locationData, req.user._id)

//   let publications = await Publication
//     .getAllByCity(Number(longitude), Number(latitude))

//   const userId = req.user._id

//   // Passing only how many likes|comments|shares it has
//   publications = publications.map(publication => {
//     let { likes, comments, shares } = publication

//     const userLiked = publication.likes.find((like) => `${like.author}` == userId)

//     publication.userLiked = (userLiked) ? true : false

//     // Remove _id for security reasons
//     delete publication._id

//     publication.likes = likes.length
//     publication.comments = comments.length
//     publication.shares = shares.length

//     return publication
//   })

//   res.status(200).json({
//     publications,
//   })
// })