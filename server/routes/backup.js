const express = require('express');
const router = express.Router();
const BackupController = require('../controllers/backupController');

router.get('/export', BackupController.exportBackup);
router.get('/info', BackupController.getBackupInfo);

module.exports = router;
