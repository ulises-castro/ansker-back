var express = require('express');
var router = express.Router();

var userController = require('controllers/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Google auth ---------------------------------
// Geting token sending code
// app.post('/api/autheticate/google/token', userController.requestGmailAuth)
// Get code
router.get('/authenticate/google', userController.getAccessTokenFromCode)
// ------------------------------------------


module.exports = router;
