import { useState, useEffect } from "react";

// Types
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// API base URL - Making sure it matches the NestJS server
const API_BASE_URL = 'http://localhost:3001';

// Local storage keys
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

// Login function
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',  // Include cookies for CORS if needed
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid email or password');
    }

    const data = await response.json();
    
    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    
    return data.user;
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
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include', // Include cookies for CORS if needed
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    
    return data.user;
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

// Get current user from API
export const fetchCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = async () => {
      // First try to get from localStorage for quick loading
      const localUser = getCurrentUser();
      setUser(localUser);
      
      // Then validate with backend
      try {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Update localStorage with latest data
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
        } else if (localUser) {
          // If backend says no user but we have local data, clear it
          logout();
          setUser(null);
        }
      } catch (error) {
        console.error("Error validating user token:", error);
      } finally {
        setLoading(false);
      }
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
    try {
      const user = await login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error in hook:', error);
      throw error;
    }
  };

  const registerFn = async (email: string, password: string, name: string) => {
    try {
      const user = await register(email, password, name);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Register error in hook:', error);
      throw error;
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
