import to from 'await-to-js'
import Publication from 'models/publication'

const getParsedPublication = () => {
}

// TODO: Create controllers and routes files, Remove boiler plate from allbycity and allbyneardistance
export const getAll = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  let publications = await Publication.getBy();

    // console.log(publications, "publications");
  // Passing only how many likes|comments|shares it has
  publications = publications.map(publication => {
    let { likes, comments, shares } = publication

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
    publication.comments = comments.length
    publication.shares = shares.length

    return publication
  })

  res.status(200).json({
    publications,
  })
}

export const getAllByCity = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  const {
    city,
    countryCode,
  } = req.params;

  const searchByCity = {
    "location.countryCode": countryCode,
    "location.city": city,
  }

  let publications = await Publication.getBy(searchByCity);

  // Passing only how many likes|comments|shares it has
  publications = publications.map(publication => {
    let { likes, comments, shares } = publication

    if (req.user) {
      const userId = req.user._id
      const userLiked = publication.likes.find((like) => `${like.author}` == userId)

      // Set user as liked
      publication.userLiked = (userLiked) ? true : false
    }

    // Remove _id for security reasons
    delete publication._id

    publication.likes = likes.length
    publication.comments = comments.length
    publication.shares = shares.length

    return publication
  })

  res.status(200).json({
    publications,
  })
}

