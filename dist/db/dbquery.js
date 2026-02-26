"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrimaryToSecondary = exports.getClusterByPrimary = exports.createSecondaryContact = exports.createPrimaryContact = exports.getMatchingContacts = void 0;
const db_1 = require("./db");
const getMatchingContacts = async (email, phoneNumber) => {
    const [rows] = await db_1.pool.query(`SELECT * FROM Contact 
     WHERE (email = ? OR phoneNumber = ?) 
     AND deletedAt IS NULL`, [email || null, phoneNumber || null]);
    return rows;
};
exports.getMatchingContacts = getMatchingContacts;
const createPrimaryContact = async (email, phoneNumber) => {
    const [result] = await db_1.pool.query(`INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
     VALUES (?, ?, NULL, 'primary', NOW(), NOW())`, [email || null, phoneNumber || null]);
    return result.insertId;
};
exports.createPrimaryContact = createPrimaryContact;
const createSecondaryContact = async (email, phoneNumber, primaryId) => {
    const [result] = await db_1.pool.query(`INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
     VALUES (?, ?, ?, 'secondary', NOW(), NOW())`, [email, phoneNumber, primaryId]);
    return result.insertId;
};
exports.createSecondaryContact = createSecondaryContact;
const getClusterByPrimary = async (primaryId) => {
    const [rows] = await db_1.pool.query(`SELECT * FROM Contact
     WHERE (id = ? OR linkedId = ?)
     AND deletedAt IS NULL`, [primaryId, primaryId]);
    return rows;
};
exports.getClusterByPrimary = getClusterByPrimary;
const updatePrimaryToSecondary = async (secondaryId, newPrimaryId) => {
    await db_1.pool.query(`UPDATE Contact
     SET linkedId = ?, linkPrecedence = 'secondary', updatedAt = NOW()
     WHERE id = ?`, [newPrimaryId, secondaryId]);
};
exports.updatePrimaryToSecondary = updatePrimaryToSecondary;
