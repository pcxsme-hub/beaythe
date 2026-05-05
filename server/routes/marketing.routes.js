import express from 'express';
import { listCoupons, upsertCoupon, deleteCoupon, validateCoupon, listPromoBanners, livePromoBanners, upsertPromoBanner, deletePromoBanner } from '../controllers/marketing.controller.js';

const router = express.Router();

// Coupons
router.get('/coupons', listCoupons);
router.post('/coupons', upsertCoupon);
router.put('/coupons', upsertCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.get('/coupons/validate/:code', validateCoupon);

// Promo banners
router.get('/banners', listPromoBanners);
router.get('/banners/live', livePromoBanners);
router.post('/banners', upsertPromoBanner);
router.put('/banners', upsertPromoBanner);
router.delete('/banners/:id', deletePromoBanner);

export default router;
