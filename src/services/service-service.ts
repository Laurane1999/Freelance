import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/services/firebase';
import type { NewServiceInput, Service } from '@/types/service';

const SERVICES_COLLECTION = 'services';

function toService(id: string, data: Record<string, unknown>): Service {
  return {
    id,
    freelanceId: typeof data.freelanceId === 'string' ? data.freelanceId : '',
    title: typeof data.title === 'string' ? data.title : '',
    price: typeof data.price === 'number' ? data.price : 0,
    description: typeof data.description === 'string' ? data.description : '',
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
  };
}

/**
 * Creates a new service listing owned by the given freelancer (MARKETPLACE phase).
 */
export async function createService(input: NewServiceInput): Promise<Service> {
  const createdAt = Date.now();
  const ref = await addDoc(collection(db, SERVICES_COLLECTION), {
    ...input,
    createdAt,
  });
  return { id: ref.id, ...input, createdAt };
}

/**
 * Lists all service listings for the marketplace, newest first.
 */
export async function listServices(): Promise<Service[]> {
  const q = query(
    collection(db, SERVICES_COLLECTION),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((entry) => toService(entry.id, entry.data()));
}

/**
 * Lists the service listings owned by a given freelancer, newest first.
 */
export async function listServicesByFreelance(
  freelanceId: string,
): Promise<Service[]> {
  const q = query(
    collection(db, SERVICES_COLLECTION),
    where('freelanceId', '==', freelanceId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((entry) => toService(entry.id, entry.data()));
}

export async function getServiceById(id: string): Promise<Service | null> {
  const snapshot = await getDoc(doc(db, SERVICES_COLLECTION, id));
  if (!snapshot.exists()) {
    return null;
  }
  return toService(snapshot.id, snapshot.data());
}
