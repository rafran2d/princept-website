const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController');

router.get('/', StatsController.getStats);
router.get('/detailed', StatsController.getDetailedStats);

module.exports = router;
