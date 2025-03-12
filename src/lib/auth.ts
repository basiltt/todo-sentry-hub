
import { useState, useEffect } from "react";

// Mock authentication since we're not connected to Supabase yet
// This will be replaced with actual Supabase auth when connected

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock users
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "user",
  },
];

// Local storage keys
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

// Mock login function
export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find((u) => u.email === email);
  
  if (!user || password !== "password") {
    throw new Error("Invalid email or password");
  }

  // Store in localStorage
  localStorage.setItem(AUTH_TOKEN_KEY, "mock-jwt-token");
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  
  return user;
};

// Mock register function
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = MOCK_USERS.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Create new user (would be done on the backend in a real app)
  const newUser: User = {
    id: Math.random().toString(36).substring(2, 9),
    email,
    name,
    role: "user", // New users are always regular users
  };

  // Store in localStorage
  localStorage.setItem(AUTH_TOKEN_KEY, "mock-jwt-token");
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

// Get current user
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_USER_KEY) {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loginFn = async (email: string, password: string) => {
    const user = await login(email, password);
    setUser(user);
    return user;
  };

  const registerFn = async (email: string, password: string, name: string) => {
    const user = await register(email, password, name);
    setUser(user);
    return user;
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
