"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeClusters = void 0;
const dbquery_1 = require("../db/dbquery");
const mergeClusters = async (primaryA, primaryB) => {
    const oldest = new Date(primaryA.createdAt) < new Date(primaryB.createdAt)
        ? primaryA
        : primaryB;
    const newest = oldest.id === primaryA.id ? primaryB : primaryA;
    await (0, dbquery_1.updatePrimaryToSecondary)(newest.id, oldest.id);
    return oldest.id;
};
exports.mergeClusters = mergeClusters;
