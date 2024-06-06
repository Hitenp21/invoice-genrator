const express = require('express');
const router = express.Router();
const controllers = require('../controllers/product.controller');
const middleware = require('../middleware/auth');

router.post('/', middleware.authenticateToken, controllers.addProduct);
router.put('/updateProduct',middleware.authenticateToken, controllers.updateProduct)
router.delete('/deleteProduct/:id',middleware.authenticateToken, controllers.deleteProduct)

// router.post('/all', controllers.getInvoices);


module.exports = router;