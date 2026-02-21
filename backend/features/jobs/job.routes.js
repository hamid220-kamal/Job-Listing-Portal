const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
} = require('./job.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.get('/mine', protect, authorize('employer'), getMyJobs);
router.route('/').get(getJobs).post(protect, authorize('employer'), createJob);
router.route('/:id').get(getJob).put(protect, authorize('employer'), updateJob).delete(protect, authorize('employer'), deleteJob);

module.exports = router;
