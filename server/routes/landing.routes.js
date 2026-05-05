import express from 'express';
import {
    listCategories,
    upsertCategory,
    deleteCategory,
    resetCategory,
    seedDefaults,
    getBundleRule,
    updateBundleRule,
    previewProduct,
    regenerateOne,
    regenerateAll
} from '../controllers/landing.controller.js';

const router = express.Router();

router.get('/categories', listCategories);
router.post('/categories', upsertCategory);
router.put('/categories', upsertCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/categories/reset/:slug', resetCategory);
router.post('/categories/seed', seedDefaults);

router.get('/bundle-rule', getBundleRule);
router.put('/bundle-rule', updateBundleRule);

router.get('/preview/:id', previewProduct);
router.post('/regenerate/:id', regenerateOne);
router.post('/regenerate-all', regenerateAll);

export default router;
