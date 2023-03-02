const express = require('express');
const router = express.Router();
const { writeReview, fetchReview } = require('../Controllers/reviewController.js');
const auth = require('../Middleware/auth');

router.post('/write',auth, writeReview);
router.get('/:gstid',auth, fetchReview);

module.exports = router;