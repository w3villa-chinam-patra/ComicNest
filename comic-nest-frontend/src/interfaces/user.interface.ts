import type { NextAction, Role } from "../types";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  address: string;
  latitude: number;
  longitude: number;
  profilePhoto: string;
  emailVerified: boolean;
  emailVerifiedAt: string;
  mobileNumber: string;
  mobileVerified: boolean;
  mobileVerifiedAt: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  nextAction: NextAction;
}
