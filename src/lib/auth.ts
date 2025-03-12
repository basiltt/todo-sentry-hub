
import { useState, useEffect } from "react";

// Types
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// API base URL - Using a mock implementation since the NestJS server is not available
const API_BASE_URL = '/api'; // Changed from 'http://localhost:3001' to use a relative path

// Local storage keys
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

// Mock data for testing without a backend
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin' as UserRole,
    password: 'password',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user' as UserRole,
    password: 'password',
  }
];

// Login function
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Since the backend is unavailable, let's use mock implementation
    const user = MOCK_USERS.find(user => user.email === email && user.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Create a mock token (this would normally come from the backend)
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    // Exclude password from the stored user object
    const { password: _, ...userWithoutPassword } = user;
    
    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Register function
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    console.log('Registering user:', { email, name });
    
    // Check if user already exists in mock data
    if (MOCK_USERS.some(user => user.email === email)) {
      throw new Error('User already exists with this email');
    }

    // Create a new mock user
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      email,
      name,
      role: 'user' as UserRole,
    };

    // Create a mock token (this would normally come from the backend)
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// React hook for authentication
export const useAuth = () => {
  // Use lazy initialization to avoid calling getCurrentUser() on every render
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_USER_KEY) {
        if (event.newValue) {
          try {
            const updatedUser = JSON.parse(event.newValue) as User;
            setUser(updatedUser);
          } catch (e) {
            console.error("Error parsing user from storage event", e);
          }
        } else {
          setUser(null);
        }
      } else if (event.key === AUTH_TOKEN_KEY && !event.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loginFn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error in hook:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerFn = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const user = await register(email, password, name);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Register error in hook:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutFn = () => {
    logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login: loginFn,
    register: registerFn,
    logout: logoutFn,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  };
};
