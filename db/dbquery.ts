import { pool } from "./db";
import { ContactRow } from "../types/api";

export const getMatchingContacts = async (
  email?: string,
  phoneNumber?: string
): Promise<ContactRow[]> => {

  const [rows] = await pool.query(
    `SELECT * FROM Contact 
     WHERE (email = ? OR phoneNumber = ?) 
     AND deletedAt IS NULL`,
    [email || null, phoneNumber || null]
  );

  return rows as ContactRow[];
};

export const createPrimaryContact = async (
  email?: string,
  phoneNumber?: string
) => {

  const [result]: any = await pool.query(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
     VALUES (?, ?, NULL, 'primary', NOW(), NOW())`,
    [email || null, phoneNumber || null]
  );

  return result.insertId;
};

export const createSecondaryContact = async (
  email: string | null,
  phoneNumber: string | null,
  primaryId: number
) => {

  const [result]: any = await pool.query(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
     VALUES (?, ?, ?, 'secondary', NOW(), NOW())`,
    [email, phoneNumber, primaryId]
  );

  return result.insertId;
};

export const getClusterByPrimary = async (primaryId: number) => {

  const [rows] = await pool.query(
    `SELECT * FROM Contact
     WHERE (id = ? OR linkedId = ?)
     AND deletedAt IS NULL`,
    [primaryId, primaryId]
  );

  return rows as ContactRow[];
};

export const updatePrimaryToSecondary = async (
  secondaryId: number,
  newPrimaryId: number
) => {

  await pool.query(
    `UPDATE Contact
     SET linkedId = ?, linkPrecedence = 'secondary', updatedAt = NOW()
     WHERE id = ?`,
    [newPrimaryId, secondaryId]
  );
};