const express = require('express');
const router = express.Router();

const passport = require('passport');

import Publication from 'models/publication';
import Comment from 'models/comment';

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}),
async function (req, res) {
  const author = req.user._id;
  let { publicationId, content } = req.body;

  const commentData = {
    publicationId,
    content,
    author,
  };

  // Implements catch of bugs
  const response = await Comment.publish(publicationId, commentData);

  if (response) {
    return res.status(200).json({
      success: true,
    });
  }

  res.status(403).json({
    success: false,
    message: 'No pudimos publicar tu comentario, inténtalo más tarde.',
    // error: 'publication.publish.comment',
  });
});

module.exports = router;
