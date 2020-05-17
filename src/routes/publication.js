const express = require('express')
const router = express.Router()

const passport = require('passport')

import Publication from 'models/publication'
import User from 'models/user'
import Comment from 'models/comment'

import { getAllByCity, getAll } from 'controllers/publication'

import { ErrorHandler } from 'helpers/error'

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {
  const {
    countryCode,
    city,
    location,
    content,
    backgroundColor,
  } = req.body;

  const backgroundColors = [
    '#0e5181', '#028f92', '#247a3e',
  ]

  const invalidDataReceived = {
      success: false,
      message: 'No pudimos procesar tu solicitud, intentalo más tarde',
  }

  if (!backgroundColor || !backgroundColors.includes(backgroundColor)) {
    return res.status(403).json(invalidDataReceived)
  }

  const longitude = location.coordinates[0]
  const latitude = location.coordinates[1]

  const newPublication = new Publication({
    authorId: req.user._id,
    content,
    backgroundColor,
    location:{
      countryCode,
      city,
      location: {
        type: 'Point',
        coordinates: [ Number(longitude), Number(latitude) ],
      }
    }
  });

  newPublication.save(function (err) {
    if (err) {
      return res.status(403).json(invalidDataReceived);
    }

    return res.status(200).json({ success: true });
  });

});


// TODO: Create controllers and routes files, Remove boiler plate from allbycity and allbyneardistance
router.get('/filter/:countryCode/:city', passport.authenticate('jwt', {
  session: false,
}), getAllByCity)

router.get('/filter/all', passport.authenticate('jwt', {
  session: false,
}), getAll)


router.post('/liked', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {
  const userData = req.user;
  const publicationId = req.body.publicationId;
  const author = userData._id;

  const publication = await Publication.setLiked(publicationId, author);

  const rest = publication[1];

  if (publication[0]) {
    res.status(200).json({
      success: true,
      rest,
    });
  } else {
    res.status(403).json({
      error: 'publication.error.setLike'
    });
  }

});

router.get('/:publicationId', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {
  console.log(req.params, "Req");

  const { publicationId } = req.params;

  const publication = await Publication
  .findOne({ publicationId })
  .select('content backgroundColor publishAt fontFamily comments.content comments.registerAt likes.author')
  .lean().exec();

  // TODO: Use populate here instead of consult
  const comments = await Comment
  .find({ publicationId: publication._id  })
  .select('content publishAt -_id')
  .lean()
  .exec()

  if (!publication) {
    return res.status(404).json({
      success: false,
    });
  }
  // Remove sensitive data and useless information
  delete publication._id;
  publication.likes = publication.likes.length;
  publication.commentsData = comments;
  publication.comments = comments.length;

  res.status(200).json({
    success: true,
    publication,
  });
});

module.exports = router;

// router.post('/allByNearDistance', passport.authenticate('jwt', {
//   session: false,
// }),
// async function(req, res) {
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

//   const {
//     Region,
//     City,
//     latitude,
//     longitude,
//     CountryCode,
//   } = req.body;

//   const locationData = {
//     countryCode: CountryCode,
//     regionName: Region,
//     city: City,
//     location: {
//       type: 'Point',
//       coordinates: [Number(longitude), Number(latitude)],
//     }
//   };

//   // TODO: Using location to avoid make this request, CHECK THIS 
//   let updatedUser = await User
//     .updateUserLocation(locationData, req.user._id);

//   let publications = await Publication
//     .getAllByCity(Number(longitude), Number(latitude));

//   const userId = req.user._id;

//   // Passing only how many likes|comments|shares it has
//   publications = publications.map(publication => {
//     let { likes, comments, shares } = publication;

//     const userLiked = publication.likes.find((like) => `${like.author}` == userId)

//     publication.userLiked = (userLiked) ? true : false;

//     // Remove _id for security reasons
//     delete publication._id;

//     publication.likes = likes.length;
//     publication.comments = comments.length;
//     publication.shares = shares.length;

//     return publication;
//   });

//   res.status(200).json({
//     publications,
//   });
// });