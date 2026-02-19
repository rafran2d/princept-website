const express = require('express');
const router = express.Router();
const LanguageController = require('../controllers/languageController');

// Routes pour les langues (ordre important : routes spécifiques avant /:id)
router.get('/', LanguageController.getAllLanguages);
router.get('/active', LanguageController.getActiveLanguages);
router.get('/default', LanguageController.getDefaultLanguage);
router.put('/reorder', LanguageController.reorderLanguages);
router.get('/:id', LanguageController.getLanguageById);
router.post('/', LanguageController.createLanguage);
router.put('/:id', LanguageController.updateLanguage);
router.patch('/:id/toggle', LanguageController.toggleLanguage);
router.patch('/:id/default', LanguageController.setDefaultLanguage);
router.delete('/:id', LanguageController.deleteLanguage);

module.exports = router;