const express = require('express');
const router = express.Router();
const controllers = require('../controllers/payment.controller');
const middleware = require('../middleware/auth');

// router.post('/', middleware.authenticateToken, controllers.addInvoice);
router.get('/' , middleware.authenticateToken, controllers.getPayment);
router.put('/update/:id' , middleware.authenticateToken, controllers.updatePaymentStatus);
router.get('/chartData',middleware.authenticateToken, controllers.chartData)
router.get('/allUserPayment',middleware.authenticateToken, controllers.allUserPayment)

// router.post('/all' , middleware.authenticateToken, controllers.getInvoices);

// router.post('/totalPrice', middleware.authenticateToken, controllers.totalPrice);


module.exports = router;