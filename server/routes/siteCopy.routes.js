import express from 'express';
import { listGroups, getAllCopy, getCopyKey, upsertCopy, resetCopy } from '../controllers/siteCopy.controller.js';

const router = express.Router();

router.get('/groups', listGroups);
router.get('/', getAllCopy);
router.get('/:key', getCopyKey);
router.put('/:key', upsertCopy);
router.post('/:key/reset', resetCopy);

export default router;
