const express = require('express');
const { variantController } = require('../../../controllers');

const { listVariants, getVariant, createVariant, updateVariant, deleteVariant } = variantController
const router = express.Router();

router.get('/list-variant', listVariants);
router.get('/get-variant/:variantId', getVariant);
router.post('/create-variant', createVariant);
router.put('/update-variant/:id', updateVariant);
router.delete('/delete-variant/:id', deleteVariant);

module.exports = router;