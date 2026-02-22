const express = require('express');
const router = express.Router();
const ThemesController = require('../controllers/themesController');

router.get('/', ThemesController.getAll);
router.post('/', ThemesController.create);
router.patch('/:id/activate', ThemesController.activate);

module.exports = router;
