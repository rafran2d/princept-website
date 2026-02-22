const express = require('express');
const router = express.Router();
const PagesController = require('../controllers/pagesController');

router.get('/', PagesController.getAll);
router.get('/:slug', PagesController.getBySlug);
router.post('/', PagesController.create);
router.put('/:id', PagesController.update);
router.delete('/:id', PagesController.delete);

module.exports = router;
