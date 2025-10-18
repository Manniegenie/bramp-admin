export interface User {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  kycLevel: number;
  kycStatus: string;
  emailVerified: boolean;
  bvnVerified: boolean;
  createdAt: string;
  updatedAt: string;
  ngnbBalance: number;
  avatarUrl: string | null;
}

export interface GetAllUsersResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
  };
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
  };
}
