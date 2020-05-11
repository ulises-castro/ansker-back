const express = require('express');
const router = express.Router();

const passport = require('passport');
const passportJWT = require('passport-jwt');

import Publication from 'models/publication';
import User from 'models/user';
import Comment from 'models/comment';

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}),

async function(req, res) {

  console.log(req.body, "Req boyd");

  // TODO: Added into middleware to avoid boilerplate
  // const { location } = req.user.location;
  // const { longitude, latitude } = req.body;

  const {
    CountryCode,
    Region,
    City,
    longitude,
    latitude,
  } = req.body;

  const newPublication = new publication({
    author: req.user._id,
    content: req.body.content,
    location: {
      countryCode: CountryCode,
      regionName: Region,
      city: City,
      location: {
        type: 'Point',
        coordinates: [ Number(longitude), Number(latitude) ],
      }
    }
  });

  newPublication.save(function (err) {
    if (err) {
      console.log(err, req.user);
      return res.status(403).json(invalidDataReceived);
    }

    return res.status(200).json({ success: true });
  });

});

router.post('/allByNearDistance', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  const {
    Region,
    City,
    latitude,
    longitude,
    CountryCode,
  } = req.body;

  console.log(req.body, req.params);

  const locationData = {
    countryCode: CountryCode,
    regionName: Region,
    city: City,
    location: {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)],
    }
  };

  // TODO: Using location to avoid make this request
  let updatedUser = await User
    .updateUserLocation(locationData, req.user._id);

  let publications = await Publication
    .getAllByCity(Number(longitude), Number(latitude));

  const userId = req.user._id;

  // Passing only how many likes|comments|shares it has
  publications = publications.map(publication => {
    let { likes, comments, shares } = publication;

    const userLiked = publication.likes.find((like) => `${like.author}` == userId)

    publication.userLiked = (userLiked) ? true : false;

    // Remove _id for security reasons
    delete publication._id;

    publication.likes = likes.length;
    publication.comments = comments.length;
    publication.shares = shares.length;

    return publication;
  });

  res.status(200).json({
    publications,
  });
});

// TODO: Create controllers and routes files, Remove boiler plate from allbycity and allbyneardistance
router.get('/allByCity',
async function(req, res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  // const {
  //   Region,
  //   City,
  //   latitude,
  //   longitude,
  //   CountryCode,
  // } = req.body;

  console.log(req.body, req.params);

  const countryCode = 'MX';
  const city = 'Guadalajara';

  let publications = await publication
    .getAllByCity(countryCode, city);

    // console.log(publications, "publications");
  // Passing only how many likes|comments|shares it has
  publications = publications.map(publication => {
    let { likes, comments, shares } = publication;

    if (req.user) {
      const userId = req.user._id;
      const userLiked = publication.likes.find((like) => `${like.author}` == userId)

      // Set user as liked
      publication.userLiked = (userLiked) ? true : false;
    }

    // Remove _id for security reasons
    delete publication._id;

    publication.likes = likes.length;
    publication.comments = comments.length;
    publication.shares = shares.length;

    return publication;
  });

  res.status(200).json({
    publications,
  });
});

router.post('/liked', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {
  const userData = req.user;
  const publicationId = req.body.publicationId;
  const author = userData._id;

  const publication = await Publication.setLiked(publicationId, author);
  // console.log(publication);

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

router.get('/:publicationId',
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
