const express = require('express');
const router = express.Router();
const {
    applyJob,
    getMyApplications,
    getJobApplications
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:jobId', protect, applyJob);
router.get('/me', protect, getMyApplications);
router.get('/job/:jobId', protect, getJobApplications);

module.exports = router;
