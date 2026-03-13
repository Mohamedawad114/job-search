import { Gender, maritalStatus, MilitarySituation, Sys_Role } from '../Enum';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture?: string;
  isConfirmed?: boolean;
  role?: Sys_Role;
  gender: Gender;
  dateBirth: Date;
  CV?: string;
  companyId?: number;
  maritalStatus: maritalStatus;
  MilitarySituation: MilitarySituation;
  isBaned?: boolean;
  bio?: string;
}
