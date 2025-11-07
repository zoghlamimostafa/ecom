// backend/routes/searchSuggestionRoute.js
const express = require('express');
const { getSuggestions } = require('../controller/searchSuggestionCtrl');
const router = express.Router();

// GET /api/search/suggestions?q=...
router.get('/suggestions', getSuggestions);

module.exports = router;
