const router = require('express').Router();
const authorize = require('../middleware/authorize');

router.get('/', (req, res) => {
    res.status(200).send("ok");
})

module.exports = router;
