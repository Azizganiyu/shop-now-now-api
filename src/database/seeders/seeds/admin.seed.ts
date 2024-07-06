import { User } from 'src/modules/user/entities/user.entity';
import { ISeeder } from '../seed.interface';

const values: User[] = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    username: 'super_admin_dev',
    avatar: 'http://localhost:3000/uploads/system/man.png',
    email: 'admin@dev.com',
    verifiedAt: new Date(),
    password: '$2b$10$P9vKg30G54vcmw3bSrSfeOYdtRv63gxXQ5QizUghVznvA7r.jiiu.',
    roleId: 'super-admin',
  },
];

export const AdminSeed: ISeeder = {
  table: 'user',
  data: values,
};
