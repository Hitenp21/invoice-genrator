const express = require('express');
const router = express.Router();
const controllers = require('../controllers/refUser.controller');
const middleware = require('../middleware/auth');

router.post('/addUser' , middleware.authenticateToken, controllers.addUser);
router.put('/updateUser/:id', middleware.authenticateToken , controllers.updateUser);
router.delete('/ref/delete/:id', middleware.authenticateToken, controllers.deleteRefUser);

router.post('/addProduct', middleware.authenticateToken , controllers.addProduct);
router.put('/updateProduct', middleware.authenticateToken , controllers.updateProduct);
router.delete('/deleteProduct', middleware.authenticateToken , controllers.deleteProduct);




module.exports = router;
