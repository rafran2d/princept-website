const express = require('express');
const router = express.Router();
const SectionsController = require('../controllers/sectionsController');

router.get('/', SectionsController.getAll);
router.get('/:id', SectionsController.getById);
router.post('/', SectionsController.create);
router.put('/:id', SectionsController.update);
router.delete('/:id', SectionsController.delete);

module.exports = router;
