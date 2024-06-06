const express = require('express');
const router = express.Router();
const controllers = require('../controllers/invoice.controller');
const middleware = require('../middleware/auth');

// router.post('/', middleware.authenticateToken, controllers.addInvoice);
router.post('/' , middleware.authenticateToken, controllers.addInvoice);
router.post('/all' , middleware.authenticateToken, controllers.getInvoices);
router.get('/count' , middleware.authenticateToken, controllers.invoiceCount);
router.get('/pdfInvoice/:id' , middleware.authenticateToken, controllers.pdfInvoice);
router.delete('/delete/:id' , middleware.authenticateToken, controllers.deleteInvoice);


module.exports = router;