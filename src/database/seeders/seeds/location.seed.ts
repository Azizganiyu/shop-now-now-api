import { ISeeder } from '../seed.interface';
import { Location } from 'src/modules/location/entities/location.entity';

const values: Location[] = [
  {
    id: '5ec86e5a-9c66-455b-982b-9f8bf261cdfe',
    name: 'Apapa',
    deliveryPrice: 6000,
  },
  {
    id: 'ca612d50-ae38-4d2a-a743-9f8f353a1f28',
    name: 'Badagry',
    deliveryPrice: 3800,
  },
  {
    id: 'e742019d-1758-4d8e-8f11-59c81275e1a0',
    name: 'Ebute Ikorodu',
    deliveryPrice: 4100,
  },
  {
    id: 'c2953b96-774d-41a3-9466-28d23b896393',
    name: 'Ejirin',
    deliveryPrice: 8200,
  },
  {
    id: '0859823b-5e6a-46e1-a148-f30829598f23',
    name: 'Epe',
    deliveryPrice: 4200,
  },
  {
    id: '08cd19e7-aed2-4207-9780-7f1ba0c53a57',
    name: 'Ikeja',
    deliveryPrice: 3800,
  },
  {
    id: '40621e8c-9348-4733-b70c-c004224f4d2e',
    name: 'Lagos',
    deliveryPrice: 7900,
  },
  {
    id: 'd08f99b5-7aaf-460c-8be7-658a63438da6',
    name: 'Makoko',
    deliveryPrice: 6300,
  },
];

export const LocationSeed: ISeeder = {
  table: 'location',
  data: values,
};
