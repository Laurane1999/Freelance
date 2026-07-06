/**
 * Mission model — mirrors the `missions` collection in Firestore (docs/03_DATABASE).
 * `serviceId`, `serviceTitle` and `createdAt` are added for display/ordering
 * (not in the schema field list; see CHANGELOG).
 */
export type MissionStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export const MISSION_STATUSES: MissionStatus[] = [
  'pending',
  'accepted',
  'completed',
  'cancelled',
];

export interface Mission {
  id: string;
  clientId: string;
  freelanceId: string;
  status: MissionStatus;
  serviceId: string | null;
  serviceTitle: string | null;
  createdAt: number;
}

/**
 * Data required to open a new mission (a client hiring a freelancer's service).
 */
export interface NewMissionInput {
  clientId: string;
  freelanceId: string;
  serviceId: string | null;
  serviceTitle: string | null;
}
