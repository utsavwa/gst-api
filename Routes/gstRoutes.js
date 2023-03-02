const express = require('express');
const router = express.Router();
const { verifyGST, recordGst, searchGST, fetchAllGst, fetchGst } = require('../Controllers/gstContoller.js');
const auth = require('../Middleware/auth');

router.post('/verify', auth, verifyGST);
router.post('/recordGst', auth, recordGst);
router.get('/searchGst/:gstin', auth, searchGST);
router.get('/', auth, fetchAllGst);
router.get('/:gstin', auth, fetchGst);

module.exports = router;