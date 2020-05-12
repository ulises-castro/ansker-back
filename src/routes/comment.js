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

  console.log(req.body, 'qué pedo mi perro');

  const commentData = {
    publicationId,
    content,
    author,
  };

  console.log(commentData, "comentarios");

  const response = await Comment.publish(publicationId, commentData);

  if (response) {
    return res.status(200).json({
      success: true,
    });
  }

  res.status(403).json({
    success: false,
    error: 'publication.publish.comment',
  });
});

module.exports = router;
