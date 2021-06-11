const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This should be the face-api verification page');
});

router.get('/success', (req, res) => {
    res.render('success');
});

router.get('/owner-verify', (req, res) => {
    res.render('owner_rtc');
});

module.exports = router;
