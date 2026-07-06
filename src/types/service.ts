/**
 * Service model — mirrors the `services` collection in Firestore (docs/03_DATABASE).
 * `createdAt` is added for stable ordering (not listed in the schema; see CHANGELOG).
 */
export interface Service {
  id: string;
  freelanceId: string;
  title: string;
  price: number;
  description: string;
  createdAt: number;
}

/**
 * Data required to create a new service listing (owned by a freelancer).
 */
export interface NewServiceInput {
  freelanceId: string;
  title: string;
  price: number;
  description: string;
}
