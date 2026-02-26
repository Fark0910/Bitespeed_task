"use strict";
const express_1 = require("express");
const identifyService_1 = require("../services/identifyService");
const router = (0, express_1.Router)();
router.post("/identify", async (req, res) => {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
        return res.status(400).json({});
    }
    try {
        const result = await (0, identifyService_1.identifyService)(email, phoneNumber);
        return res.status(200).json({
            contact: result
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({});
    }
});
module.exports = router;
