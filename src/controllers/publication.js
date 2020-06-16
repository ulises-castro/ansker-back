import Publication from 'models/publication'
import Comment from 'models/comment'

import firebaseAdmin from 'firebase'

const tokens = [
  "dtHVKGT7z-iMRhY8h-zvbk:APA91bEJaz8cQah4AyH3SiAmiuGuJhEsxJIMwOIHTda87HV184X2o5xIOgT5tb74HqZLZLKgNf73CWlYomqUdcBdYaaH0clKlIEcLKMxcEyKBe4Xo20pdTyLy16Kmu2TEjsiubGeyelx",
"epG24qi-JqiyTbGv4Vlo2O:APA91bHR7CeFVGbsaX59P9rjP9-p240ndbdhz2X0r0q7wWu6dd7IO1NZxAvTAjTDEJdoYARekWd95ROa2T9Wn4jTbunZsRoMOIkHhAOA-hZZ4ZRPiv24EM2-xbOnXPGAe-SCaPqxXIfv",
"eccHX8tI1xycOBin5QVvJx:APA91bG2Kpvjxf-X84o_CS28XVxrQVRzLlPwyOpVE3UCJ9gGnpLzn44WnVs5ioCabX54ZAblF3wV1r_LXyHLvT8XCoFs1URyDqWzxU8WsQxIN33HVB3qupiVId9JzFql02yQHP",
"cK4Rzwv6XfncsV5Khq-lhM:APA91bH1ervIfl_dD2bFfQ_5-5DsBrJn2Gwvpb_zDL4qShASYmlDopReHjkjO0JJq2J4O3sH7bI9sNKcJb28VBXWxg3tt6yVWkL-nPKGrUQDIkyjySVQl9G3XyAQUGJkBm7-UK2OkREF"];

// "notification": {
//   "title": "FCM Message",
//   "body": "This is a message from FCM"
// },
// "webpush": {
//   "headers": {
//     "Urgency": "high"
//   },
//   "notification": {
//     "body": "This is a message from FCM to web",
//     "requireInteraction": "true",
//     "badge": "/badge-icon.png"
//   }
// },
// const message = {
//   "notification": {
//     "title": "FCM Message",
//     "body": "This is a message from FCM"
//   },
//   data: {score: '850', time: '2:45'},
//   tokens,
// }

// firebaseAdmin.messaging().sendMulticast(message)
//   .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });

import { formatText, sendTelegramMsg} from 'helpers'

const getParsedPublication = () => {
}

export const report = async (req, res) => {
  sendTelegramMsg(`REPORTED PUBLICATION \n El usuario ${req.user._id}, message:  \n .`)
}

// TODO: Create controllers and routes files, Remove boiler plate from allbycity and allbyneardistance
export const getAll = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')

  const {
    pageNumber
  } = req.params

  let publications = await Publication.getBy({}, pageNumber)

  // Passing only how many votes|comments|shares it has
  publications = publications.map(publication => {
    let { votes, shares } = publication

    // TODO: Factorize this, become to one function
    if (req.user) {
      const userId = req.user._id
      const userVotedUp = publication.votes.find((vote) => `${vote.authorId}` == userId)

      // Set user as liked
      publication.userVotedUp = (userVotedUp) ? true : false
    }

    // Remove _id for security reasons
    delete publication._id

    publication.votes = votes.length
    publication.shares = shares.length

    return publication
  })

  res.status(200).json({
    publications,
  })
}

export const getAllByCity = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')

  const {
    city,
    pageNumber,
    countryCode,
  } = req.params

  const searchByCity = {
    "location.city": city,
    "location.countryCode": countryCode,
  }

  let publications = await Publication.getBy(searchByCity, pageNumber)

  // Passing only how many votes|comments|shares it has
  publications = publications.map(publication => {
    let { votes, shares } = publication

    if (req.user) {
      const userId = req.user._id
      const userVotedUp = votes.find((vote) => `${vote.authorId}` == userId)

      // Set user as liked
      publication.userVotedUp = (userVotedUp) ? true : false
    }

    // Remove _id for security reasons
    delete publication._id

    publication.votes = votes.length
    publication.shares = shares.length

    return publication
  })

  res.status(200).json({
    publications,
  })
}

export const getPublication = async (req, res) => {
  console.log(req.params, "Req")

  const { publicationId } = req.params

  const publication = await Publication
  .findOne({ publicationId })
  .select('content backgroundColor publishAt fontFamily votes.author')
  .lean().exec()

  // TODO: Use populate here instead of consult
  const comments = await Comment
  .find({ publicationId: publication._id  })
  .select('content publishAt -_id')
  .lean()
  .exec()

  if (!publication) {
    return res.status(404).json({
      success: false,
    })
  }
  // Remove sensitive data and useless information
  delete publication._id
  publication.votes = publication.votes.length
  publication.commentsData = comments
  // publication.comments = comments.length

  res.status(200).json({
    success: true,
    publication,
  })
}

export const publish = async (req, res) => {
  let {
    countryCode,
    city,
    location,
    content,
    backgroundColor,
  } = req.body

  const backgroundColors = [
    '#0e5181', '#028f92', '#247a3e',
  ]

  const invalidDataReceived = {
      success: false,
      message: 'No pudimos procesar tu solicitud, intentalo más tarde',
  }

  if (!backgroundColor || !backgroundColors.includes(backgroundColor) || (!city || !countryCode)) {
    return res.status(403).json(invalidDataReceived)
  }

  const longitude = location.coordinates[0]
  const latitude = location.coordinates[1]

  content = formatText(content)

  const newPublication = new Publication({
    authorId: req.user._id,
    content,
    backgroundColor,
    location: {
      countryCode,
      city,
      location: {
        type: 'Point',
        coordinates: [ Number(longitude), Number(latitude) ],
      }
    }
  })

  newPublication.save(function (err) {
    if (err) {
      return res.status(403).json(invalidDataReceived)
    }

    return res.status(200).json({ success: true })
  })
}

export const voteUp = async function(req, res) {
  const userData = req.user
  const author = userData._id
  let publicationId = req.body.publicationId

  const publication = await Publication.setVote(publicationId, author)

  const rest = publication[1]

  if (publication[0]) {
    res.status(200).json({
      success: true,
      rest,
    })
  } else {
    res.status(403).json({
      error: 'publication.error.voteUp'
    })
  }
}
