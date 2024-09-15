const express = require('express');
const router = express.Router();
const { getAllExchangeRates } = require('../controllers/generalController');

router.get('/', getAllExchangeRates);

module.exports = router;