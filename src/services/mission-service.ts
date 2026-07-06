import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/services/firebase';
import type {
  Mission,
  MissionStatus,
  NewMissionInput,
} from '@/types/mission';

const MISSIONS_COLLECTION = 'missions';

function toMission(id: string, data: Record<string, unknown>): Mission {
  return {
    id,
    clientId: typeof data.clientId === 'string' ? data.clientId : '',
    freelanceId: typeof data.freelanceId === 'string' ? data.freelanceId : '',
    status: (typeof data.status === 'string' ? data.status : 'pending') as MissionStatus,
    serviceId: typeof data.serviceId === 'string' ? data.serviceId : null,
    serviceTitle: typeof data.serviceTitle === 'string' ? data.serviceTitle : null,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
  };
}

/**
 * Opens a new mission with status `pending` (MISSIONS phase).
 */
export async function createMission(input: NewMissionInput): Promise<Mission> {
  const createdAt = Date.now();
  const data = { ...input, status: 'pending' as MissionStatus, createdAt };
  const ref = await addDoc(collection(db, MISSIONS_COLLECTION), data);
  return { id: ref.id, ...data };
}

/**
 * Lists every mission the user takes part in (as client or freelancer),
 * newest first. Firestore cannot OR two fields in one query, so we run one
 * query per role and merge.
 */
export async function listMissionsForUser(userId: string): Promise<Mission[]> {
  const missionsRef = collection(db, MISSIONS_COLLECTION);
  const [asClient, asFreelance] = await Promise.all([
    getDocs(query(missionsRef, where('clientId', '==', userId))),
    getDocs(query(missionsRef, where('freelanceId', '==', userId))),
  ]);

  const byId = new Map<string, Mission>();
  for (const entry of [...asClient.docs, ...asFreelance.docs]) {
    byId.set(entry.id, toMission(entry.id, entry.data()));
  }

  return Array.from(byId.values()).sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Updates the lifecycle status of a mission (accept / complete / cancel).
 */
export async function updateMissionStatus(
  id: string,
  status: MissionStatus,
): Promise<void> {
  await updateDoc(doc(db, MISSIONS_COLLECTION, id), { status });
}

export async function getMissionById(id: string): Promise<Mission | null> {
  const snapshot = await getDoc(doc(db, MISSIONS_COLLECTION, id));
  if (!snapshot.exists()) {
    return null;
  }
  return toMission(snapshot.id, snapshot.data());
}
