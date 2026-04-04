export interface ICompany {
  name: string;
  logo?: string;
  description?: string;
  email: string;
  website?: string;
  adminId: number;
  address?: string;
  formatAddress?: string;
  latitude?: number;
  longitude?: number;
  workTypeId: number;
}
