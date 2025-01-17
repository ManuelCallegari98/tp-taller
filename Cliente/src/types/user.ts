// src/types/user.ts
export interface User {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  isAdmin: boolean;
}