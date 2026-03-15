const express = require('express');
const router = express.Router();
const {
    applyJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    getEmployerApplications,
} = require('./application.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.post('/:jobId', protect, authorize('candidate'), applyJob);
router.get('/me', protect, getMyApplications);
router.get('/employer', protect, authorize('employer'), getEmployerApplications);
router.get('/job/:jobId', protect, getJobApplications);
router.patch('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
