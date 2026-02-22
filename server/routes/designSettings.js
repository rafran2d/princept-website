const express = require('express');
const router = express.Router();
const DesignSettingsController = require('../controllers/designSettingsController');

router.get('/', DesignSettingsController.getAll);
router.post('/', DesignSettingsController.set);

module.exports = router;
