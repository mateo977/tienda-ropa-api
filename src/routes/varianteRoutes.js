const express = require('express');
const router = express.Router();

const varianteController = require('../controllers/varianteController');

router.get('/', varianteController.getVariantes);
router.get('/:id', varianteController.getVarianteById);
router.post('/', varianteController.postVariante);
router.put('/:id', varianteController.putVariante);
router.delete('/:id', varianteController.deleteVariante);

module.exports = router;
