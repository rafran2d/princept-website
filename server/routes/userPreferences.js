const express = require('express');
const router = express.Router();
const UserPreferencesController = require('../controllers/userPreferencesController');

router.get('/', UserPreferencesController.getAll);
router.post('/', UserPreferencesController.set);

module.exports = router;
