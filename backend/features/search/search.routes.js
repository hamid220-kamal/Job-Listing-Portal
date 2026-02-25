const express = require('express');
const router = express.Router();
const { searchJobs, getCompanies } = require('./search.controller');

router.get('/', searchJobs);
router.get('/companies', getCompanies);

module.exports = router;
