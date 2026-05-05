import express from 'express';
import { getTheme, updateTheme, resetTheme } from '../controllers/theme.controller.js';

const router = express.Router();
router.get('/', getTheme);
router.put('/', updateTheme);
router.post('/reset', resetTheme);

export default router;
