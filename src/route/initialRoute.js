const express = require('express');
const router = express.Router();
const initialController = require('../controller/initialController');

router.get('/', initialController.paginaInicial);

module.exports = router;