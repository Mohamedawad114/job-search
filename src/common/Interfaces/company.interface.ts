export interface ICompany {
  name: string;
  employeeNumber: number;
  logo: string;
  description: string;
  email: string;
  website?: string;
  adminId: number;
  address?: string;
  formatAddress?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  workType: string;
}
