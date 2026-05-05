import express from 'express';
import { getHomeConfig, updateHomeConfig, resetHomeConfig } from '../controllers/home.controller.js';

const router = express.Router();

router.get('/', getHomeConfig);
router.put('/', updateHomeConfig);
router.post('/reset', resetHomeConfig);

export default router;
