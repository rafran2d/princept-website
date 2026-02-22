const express = require('express');
const router = express.Router();
const SiteSettingsController = require('../controllers/siteSettingsController');

router.get('/', SiteSettingsController.getAll);
router.post('/', SiteSettingsController.set);

module.exports = router;
