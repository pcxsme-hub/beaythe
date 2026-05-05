import express from 'express';
import { getNavConfig, updateNavConfig, resetNavConfig } from '../controllers/nav.controller.js';

const router = express.Router();
router.get('/', getNavConfig);
router.put('/', updateNavConfig);
router.post('/reset', resetNavConfig);

export default router;
