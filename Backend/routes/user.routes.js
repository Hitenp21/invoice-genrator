const express = require('express');
const router = express.Router();
const controllers = require('../controllers/user.controller');
const middleware = require('../middleware/auth');


router.post('/signup', controllers.signup);
router.post('/login', controllers.login);
router.put('/user/update', middleware.authenticateToken, controllers.updateUser);
router.get('/getUser', middleware.authenticateToken, controllers.getUser);
router.post('/update-password', controllers.updatePassword);


router.post('/logout', middleware.authenticateToken, controllers.logout);
router.get('/getData',middleware.authenticateToken, controllers.getAllRefUserDAta)

module.exports = router;
