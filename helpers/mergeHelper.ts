import { ContactRow } from "../types/api";
import { updatePrimaryToSecondary } from "../db/dbquery";
export const mergeClusters = async (
  primaryA: ContactRow,
  primaryB: ContactRow
) => {
  const oldest =
    new Date(primaryA.createdAt) <new Date(primaryB.createdAt)
      ?primaryA
      :primaryB;
  const newest = oldest.id === primaryA.id ? primaryB : primaryA;
  await updatePrimaryToSecondary(newest.id, oldest.id);
  return oldest.id;
};