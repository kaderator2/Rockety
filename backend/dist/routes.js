"use strict";
var express = require('express');
var router = express.Router();
// free endpoint
router.get("/free-endpoint", (req, res) => {
    res.json({ message: "You are free to access me anytime" });
});
module.exports = router;
