import { Role } from 'src/modules/role/entities/role.entity';
import { ISeeder } from '../seed.interface';

const values: Role[] = [
  {
    id: 'super-admin',
    tag: 'admin',
    name: 'Super Admin',
  },
  {
    id: 'admin',
    tag: 'admin',
    name: 'Admin',
  },
  {
    id: 'manager',
    tag: 'admin',
    name: 'Manager',
  },
  {
    id: 'supervisor',
    tag: 'admin',
    name: 'Supervisor',
  },
  {
    id: 'cashier',
    tag: 'admin',
    name: 'Cashier',
  },
  {
    id: 'user',
    tag: 'user',
    name: 'User',
  },
];

export const RoleSeed: ISeeder = {
  table: 'role',
  data: values,
};
