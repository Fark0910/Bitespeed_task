"use strict";
const propid_query_exist = async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ status: "error", response: "PropertyId and query were missing", error: "missing Fields!" });
    }
    if (!req.body.query) {
        return res.status(400).json({ status: "error", response: "Query parameter was missing", error: "missing Fields!" });
    }
    next();
};
module.exports = propid_query_exist;
