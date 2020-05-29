
import Comment from 'models/comment'

export const publish = async (req, res) => {
  const authorId = req.user._id
  let { publicationId, content } = req.body

  const commentData = {
    publicationId,
    content,
    authorId,
  }

  // Implements catch of bugs
  const response = await Comment.publish(publicationId, commentData)

  if (response) {
    return res.status(200).json({
      success: true,
    })
  }

  res.status(403).json({
    success: false,
    message: 'No pudimos publicar tu comentario, inténtalo más tarde.',
  })
}

export const getAll = async (req, res) => {
  const { publicationId } = req.params

  const userId = req.user.id
  const comments = await Comment.getAll(publicationId, userId)

  if (comments) {
    return res.status(200).json({
      success: true,
      comments
    })
  }

  res.status(403).json({
    success: false,
    message: 'No pudimos publicar tu comentario, inténtalo más tarde.',
  })
}