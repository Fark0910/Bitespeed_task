import { ContactRow } from "../types/api";

export const getPrimaryId = (contact: ContactRow): number => {
  return contact.linkPrecedence === "primary"
    ? contact.id
    : contact.linkedId!;
};

export const getOldestPrimary = (contacts: ContactRow[]): ContactRow => {

  const primaries = contacts.filter(
    (c) => c.linkPrecedence === "primary"
  );

  primaries.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return primaries[0];
};

export const consolidateCluster = (contacts: ContactRow[]) => {

  const emails = new Set<string>();
  const phones = new Set<string>();
  const secondaryIds: number[] = [];

  contacts.forEach(c => {
    if (c.email) emails.add(c.email);
    if (c.phoneNumber) phones.add(c.phoneNumber);
    if (c.linkPrecedence === "secondary") secondaryIds.push(c.id);
  });

  const primary = contacts.find(c => c.linkPrecedence === "primary")!;

  return {
    primaryContactId: primary.id,
    emails: [...emails],
    phoneNumbers: [...phones],
    secondaryContactIds: secondaryIds
  };
};
