const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('verify');
});

router.get('/success', (req, res) => {
    res.render('success');
});

router.get('/owner-verify', (req, res) => {
    res.render('owner_rtc');
});

module.exports = router;
