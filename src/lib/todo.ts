
import { User } from "./auth";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  userName: string;
  createdAt: Date;
}

// API base URL
const API_BASE_URL = 'http://localhost:3001';

// Get auth token from local storage
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Get todos for a user
export const getTodos = async (currentUser: User): Promise<Todo[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch todos');
    }

    const todos = await response.json();
    
    // Ensure createdAt is a Date object
    return todos.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

// Add a new todo
export const addTodo = async (text: string, currentUser: User): Promise<Todo> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add todo');
    }

    const todo = await response.json();
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
    };
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};

// Toggle todo completion status
export const toggleTodoComplete = async (id: string, currentUser: User): Promise<Todo> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to toggle todo');
    }

    const todo = await response.json();
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
    };
  } catch (error) {
    console.error("Error toggling todo:", error);
    throw error;
  }
};

// Edit a todo
export const editTodo = async (id: string, text: string, currentUser: User): Promise<Todo> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to edit todo');
    }

    const todo = await response.json();
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
    };
  } catch (error) {
    console.error("Error editing todo:", error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (id: string, currentUser: User): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete todo');
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};
