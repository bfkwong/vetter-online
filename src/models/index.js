// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Prescription, Visit, Pet, Vet, Patient } = initSchema(schema);

export {
  Prescription,
  Visit,
  Pet,
  Vet,
  Patient
};