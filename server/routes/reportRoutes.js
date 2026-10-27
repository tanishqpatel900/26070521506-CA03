const express = require('express');
const router = express.Router();
const { exportCSV, getSummaryReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/export', exportCSV);
router.get('/export-csv', exportCSV);
router.get('/summary', getSummaryReport);

module.exports = router;
