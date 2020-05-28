import Publication from 'models/publication'
import Comment from 'models/comment'

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

  // Passing only how many likes|comments|shares it has
  publications = publications.map(publication => {
    let { likes, shares } = publication

    // TODO: Factorize this, become to one function
    if (req.user) {
      const userId = req.user._id
      const userLiked = publication.likes.find((like) => `${like.author}` == userId)

      // Set user as liked
      publication.userLiked = (userLiked) ? true : false
    }

    // Remove _id for security reasons
    delete publication._id

    publication.likes = likes.length
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

  // Passing only how many likes|comments|shares it has
  publications = publications.map(publication => {
    let { likes, shares } = publication

    if (req.user) {
      const userId = req.user._id
      const userLiked = publication.likes.find((like) => `${like.author}` == userId)

      // Set user as liked
      publication.userLiked = (userLiked) ? true : false
    }

    // Remove _id for security reasons
    delete publication._id

    publication.likes = likes.length
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
  .select('content backgroundColor publishAt fontFamily likes.author')
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
  publication.likes = publication.likes.length
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

export const setLike = async function(req, res) {
  const userData = req.user
  const publicationId = req.body.publicationId
  const author = userData._id

  const publication = await Publication.setLiked(publicationId, author)

  const rest = publication[1]

  if (publication[0]) {
    res.status(200).json({
      success: true,
      rest,
    })
  } else {
    res.status(403).json({
      error: 'publication.error.setLike'
    })
  }
}