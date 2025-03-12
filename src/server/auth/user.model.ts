
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string; // In a real app, this would be hashed
}

export type UserDto = Omit<User, 'password'>;
