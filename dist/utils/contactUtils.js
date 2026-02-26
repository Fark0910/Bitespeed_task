"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consolidateCluster = exports.getOldestPrimary = exports.getPrimaryId = void 0;
const getPrimaryId = (contact) => {
    return contact.linkPrecedence === "primary"
        ? contact.id
        : contact.linkedId;
};
exports.getPrimaryId = getPrimaryId;
const getOldestPrimary = (contacts) => {
    const primaries = contacts.filter((c) => c.linkPrecedence === "primary");
    primaries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return primaries[0];
};
exports.getOldestPrimary = getOldestPrimary;
const consolidateCluster = (contacts) => {
    const emails = new Set();
    const phones = new Set();
    const secondaryIds = [];
    contacts.forEach(c => {
        if (c.email)
            emails.add(c.email);
        if (c.phoneNumber)
            phones.add(c.phoneNumber);
        if (c.linkPrecedence === "secondary")
            secondaryIds.push(c.id);
    });
    const primary = contacts.find(c => c.linkPrecedence === "primary");
    return {
        primaryContactId: primary.id,
        emails: [...emails],
        phoneNumbers: [...phones],
        secondaryContactIds: secondaryIds
    };
};
exports.consolidateCluster = consolidateCluster;
