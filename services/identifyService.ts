import {
  getMatchingContacts,
  createPrimaryContact,
  createSecondaryContact,
  getClusterByPrimary
} from "../db/dbquery";

import {
  getPrimaryId,
  consolidateCluster
} from "../utils/contactUtils";
import { mergeClusters } from "../helpers/mergeHelper";
export const identifyService = async (
  email?: string,
  phoneNumber?: string
) => {
  const matches = await getMatchingContacts(email, phoneNumber);
  if (matches.length === 0) {
    const newPrimaryId = await createPrimaryContact(email, phoneNumber);
    const cluster = await getClusterByPrimary(newPrimaryId);
    return consolidateCluster(cluster);
  }

  const primaryIds = new Set<number>();

  matches.forEach(m => primaryIds.add(getPrimaryId(m)));

  const primaryList = [...primaryIds];

  let finalPrimaryId = primaryList[0];

  if (primaryList.length > 1) {

    const clusters = await Promise.all(
      primaryList.map(id => getClusterByPrimary(id))
    );

    const primaries = clusters.map(c =>
      c.find(row => row.linkPrecedence === "primary")!
    );

    finalPrimaryId = await mergeClusters(primaries[0], primaries[1]);
  }

  const cluster = await getClusterByPrimary(finalPrimaryId);

  const emailExists = cluster.some(c => c.email === email);
  const phoneExists = cluster.some(c => c.phoneNumber === phoneNumber);

  if (!emailExists || !phoneExists) {
    await createSecondaryContact(
      email || null,
      phoneNumber || null,
      finalPrimaryId
    );
  }

  const updatedCluster = await getClusterByPrimary(finalPrimaryId);

  return consolidateCluster(updatedCluster);
};