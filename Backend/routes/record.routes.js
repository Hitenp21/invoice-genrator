const express = require('express');
const router = express.Router();
const controllers = require('../controllers/record.controller');
const middleware = require('../middleware/auth');

router.post('/', middleware.authenticateToken, controllers.getSubUserData);
router.post('/totalPrice', middleware.authenticateToken, controllers.totalPrice);


module.exports = router;