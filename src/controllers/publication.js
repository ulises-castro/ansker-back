import Publication from 'models/publication'
import Comment from 'models/comment'

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

import { formatText, sendTelegramMsg} from 'helpers'
import { suscribeUserToTopic } from './notification';

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


  newPublication.save(async function (err, createdPublication) {
    if (err) {
      return res.status(403).json(invalidDataReceived)
    }

    const response = await suscribeUserToTopic(req.user._id, `user-publication-${createdPublication._id}`)

    if (!response) {
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
