const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const axios = require('axios');

import Secret from '../models/secret';
import User from '../models/user';

require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {

  const availableColours = [
    '#0000ff', '#ffa500', '#065535',
    '#ffc0cb', '#ff0000', '#003366',
    '#008080', '#8a2be2', '#666666',
    '#ff1493'
  ];

  // console.log(req.user, "Holaaaa");
  const invalidDataReceived = {
    error: 'secret.publish.invalid'
  };

  // Sended an invalid color, received an no-valid color
  if (availableColours.indexOf(req.body.backgroundColor) === -1) {
    res.status(403).json(invalidDataReceived);
  }

  // TODO: Added into middleware to avoid boilerplate
  // const { location } = req.user.location;
  const { longitude, latitude } = req.body;

  // TODO: Modularize this into one file
  // const geolocationUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?token=${process.env.GEOLOCATION_TOKEN}&f=pjson&featureTypes=&location=${longitude},${latitude}`;

  const getlocationUrl = `https://utility.arcgis.com/usrsvcs/appservices/ALYmls905v3B6fIJ/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${longitude},${latitude}`

  const geolocation = await axios.get(geolocationUrl);

  // console.log(geolocation, "Geolocaiton");

  const {
    CountryCode,
    Region,
    City,
  } = geolocation.data.address;

  const newSecret = new Secret({
    author: req.user._id,
    content: req.body.content,
    backgroundColor: req.body.backgroundColor,
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

  newSecret.save(function (err) {
    if (err) {
      console.log(err, req.user);
      return res.status(403).json(invalidDataReceived);
    }

    return res.status(200).json({ success: true });
  });

});

router.get('/allByCity', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  const { latitude, longitude } = req.query;

  // TODO: Modularize this into one file
  // const geolocationUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?token=${process.env.GEOLOCATION_TOKEN}&f=pjson&featureTypes=&location=${longitude},${latitude}`;

  const geolocationUrl = `https://utility.arcgis.com/usrsvcs/appservices/ALYmls905v3B6fIJ/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${longitude},${latitude}`

  const geolocation = await axios.get(geolocationUrl);

  console.log(geolocation, "Geolocaiton");

  const {
    Region,
    City,
    CountryCode,
  } = geolocation.data.address;

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

  let secrets = await Secret
    .getAllByCity(Number(longitude), Number(latitude));

  const userId = req.user._id;

  // Passing only how many likes|comments|shares it has
  secrets = secrets.map(secret => {
    let { likes, comments, shares } = secret;

    const userLiked = secret.likes.find((like) => `${like.author}` == userId)

    secret.userLiked = (userLiked) ? true : false;

    // Remove _id for security reasons
    delete secret._id;

    secret.likes = likes.length;
    secret.comments = comments.length;
    secret.shares = shares.length;

    return secret;
  });

  res.status(200).json({
    secrets,
  });
});

router.post('/liked', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {
  const userData = req.user;
  const secretId = req.body.secretId;
  const author = userData._id;

  const secret = await Secret.setLiked(secretId, author);
  // console.log(secret);

  const rest = secret[1];

  if (secret[0]) {
    res.status(200).json({
      success: true,
      rest,
    });
  } else {
    res.status(403).json({
      error: 'secret.error.setLike'
    });
  }

});

router.get('/:secretId', async function(req, res) {
  console.log(req.params, "Req");

  const { secretId } = req.params;

  const secret = await Secret
  .findOne({ secretId })
  .select('content backgroundColor publishAt fontFamily comments.content comments.registerAt likes.author')
  .lean().exec();

  if (!secret) {
    return res.status(404).json({
      success: false,
    });
  }
  // Remove sensitive data and useless information
  delete secret._id;
  secret.likes = secret.likes.length;
  secret.commentsData = secret.comments;
  secret.comments = secret.comments.length;

  res.status(200).json({
    success: true,
    secret,
  });
});

module.exports = router;
