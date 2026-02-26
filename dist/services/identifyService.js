"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyService = void 0;
const dbquery_1 = require("../db/dbquery");
const contactUtils_1 = require("../utils/contactUtils");
const mergeHelper_1 = require("../helpers/mergeHelper");
const identifyService = async (email, phoneNumber) => {
    const matches = await (0, dbquery_1.getMatchingContacts)(email, phoneNumber);
    if (matches.length === 0) {
        const newPrimaryId = await (0, dbquery_1.createPrimaryContact)(email, phoneNumber);
        const cluster = await (0, dbquery_1.getClusterByPrimary)(newPrimaryId);
        return (0, contactUtils_1.consolidateCluster)(cluster);
    }
    const primaryIds = new Set();
    matches.forEach(m => primaryIds.add((0, contactUtils_1.getPrimaryId)(m)));
    const primaryList = [...primaryIds];
    let finalPrimaryId = primaryList[0];
    if (primaryList.length > 1) {
        const clusters = await Promise.all(primaryList.map(id => (0, dbquery_1.getClusterByPrimary)(id)));
        const primaries = clusters.map(c => c.find(row => row.linkPrecedence === "primary"));
        finalPrimaryId = await (0, mergeHelper_1.mergeClusters)(primaries[0], primaries[1]);
    }
    const cluster = await (0, dbquery_1.getClusterByPrimary)(finalPrimaryId);
    const emailExists = cluster.some(c => c.email === email);
    const phoneExists = cluster.some(c => c.phoneNumber === phoneNumber);
    if (!emailExists || !phoneExists) {
        await (0, dbquery_1.createSecondaryContact)(email || null, phoneNumber || null, finalPrimaryId);
    }
    const updatedCluster = await (0, dbquery_1.getClusterByPrimary)(finalPrimaryId);
    return (0, contactUtils_1.consolidateCluster)(updatedCluster);
};
exports.identifyService = identifyService;
