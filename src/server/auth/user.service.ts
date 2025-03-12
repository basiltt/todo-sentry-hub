
import { Injectable } from '@nestjs/common';
import { User, UserRole } from './user.model';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      password: 'password', // In a real app, this would be hashed
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      password: 'password', // In a real app, this would be hashed
    },
  ];

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  create(email: string, password: string, name: string): User {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
      role: 'user', // New users are always regular users
      password,
    };

    this.users.push(newUser);
    return newUser;
  }
}
