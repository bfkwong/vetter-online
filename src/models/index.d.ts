import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PrescriptionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type VisitMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PetMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type VetMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PatientMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Prescription {
  readonly id: string;
  readonly medicine?: string | null;
  readonly instruction?: string | null;
  readonly visitID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Prescription, PrescriptionMetaData>);
  static copyOf(source: Prescription, mutator: (draft: MutableModel<Prescription, PrescriptionMetaData>) => MutableModel<Prescription, PrescriptionMetaData> | void): Prescription;
}

export declare class Visit {
  readonly id: string;
  readonly petId?: string | null;
  readonly vetId?: string | null;
  readonly visitNotes?: string | null;
  readonly Prescriptions?: (Prescription | null)[] | null;
  readonly visitTime?: string | null;
  readonly visitReason?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Visit, VisitMetaData>);
  static copyOf(source: Visit, mutator: (draft: MutableModel<Visit, VisitMetaData>) => MutableModel<Visit, VisitMetaData> | void): Visit;
}

export declare class Pet {
  readonly id: string;
  readonly name?: string | null;
  readonly birthday?: string | null;
  readonly weight?: number | null;
  readonly species?: string | null;
  readonly breed?: string | null;
  readonly Vet?: Vet | null;
  readonly patientID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly petVetId?: string | null;
  constructor(init: ModelInit<Pet, PetMetaData>);
  static copyOf(source: Pet, mutator: (draft: MutableModel<Pet, PetMetaData>) => MutableModel<Pet, PetMetaData> | void): Pet;
}

export declare class Vet {
  readonly id: string;
  readonly name: string;
  readonly specialty?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Vet, VetMetaData>);
  static copyOf(source: Vet, mutator: (draft: MutableModel<Vet, VetMetaData>) => MutableModel<Vet, VetMetaData> | void): Vet;
}

export declare class Patient {
  readonly id: string;
  readonly name: string;
  readonly Pets?: (Pet | null)[] | null;
  readonly cognitoId?: string | null;
  readonly cardNum?: string | null;
  readonly cardCVV?: string | null;
  readonly cardExpDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Patient, PatientMetaData>);
  static copyOf(source: Patient, mutator: (draft: MutableModel<Patient, PatientMetaData>) => MutableModel<Patient, PatientMetaData> | void): Patient;
}