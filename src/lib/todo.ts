
import { User } from "./auth";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  userName: string;
  createdAt: Date;
}

// API base URL - Using a mock implementation since the NestJS server is not available
const API_BASE_URL = '/api'; // Changed from 'http://localhost:3001' to a relative path

// Local storage key for mock todos
const TODOS_STORAGE_KEY = "mock_todos";

// Get auth token from local storage
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Initialize mock todos in localStorage if not already present
const initializeMockTodos = () => {
  if (!localStorage.getItem(TODOS_STORAGE_KEY)) {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get todos for a user
export const getTodos = async (currentUser: User): Promise<Todo[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  try {
    // Initialize mock todos if not already done
    initializeMockTodos();
    
    // Get todos from localStorage
    const todosJson = localStorage.getItem(TODOS_STORAGE_KEY);
    const allTodos = JSON.parse(todosJson || '[]');
    
    // Filter todos based on user role
    const userTodos = currentUser.role === 'admin' 
      ? allTodos 
      : allTodos.filter((todo: Todo) => todo.userId === currentUser.id);
    
    // Convert string dates to Date objects
    return userTodos.map((todo: any) => ({
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
    // Initialize mock todos if not already done
    initializeMockTodos();
    
    // Get existing todos
    const todosJson = localStorage.getItem(TODOS_STORAGE_KEY);
    const todos = JSON.parse(todosJson || '[]');
    
    // Create a new todo
    const newTodo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString()
    };
    
    // Add the new todo to the list
    todos.unshift(newTodo);
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    
    // Return the new todo with the createdAt field as a Date object
    return {
      ...newTodo,
      createdAt: new Date(newTodo.createdAt),
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
    // Initialize mock todos if not already done
    initializeMockTodos();
    
    // Get existing todos
    const todosJson = localStorage.getItem(TODOS_STORAGE_KEY);
    const todos = JSON.parse(todosJson || '[]');
    
    // Find the todo to toggle
    const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    // Check if user is authorized to modify this todo
    if (currentUser.role !== 'admin' && todos[todoIndex].userId !== currentUser.id) {
      throw new Error('Unauthorized to modify this todo');
    }
    
    // Toggle the completion status
    todos[todoIndex].completed = !todos[todoIndex].completed;
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    
    // Return the updated todo with the createdAt field as a Date object
    return {
      ...todos[todoIndex],
      createdAt: new Date(todos[todoIndex].createdAt),
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
    // Initialize mock todos if not already done
    initializeMockTodos();
    
    // Get existing todos
    const todosJson = localStorage.getItem(TODOS_STORAGE_KEY);
    const todos = JSON.parse(todosJson || '[]');
    
    // Find the todo to edit
    const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    // Check if user is authorized to modify this todo
    if (currentUser.role !== 'admin' && todos[todoIndex].userId !== currentUser.id) {
      throw new Error('Unauthorized to modify this todo');
    }
    
    // Update the todo text
    todos[todoIndex].text = text;
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    
    // Return the updated todo with the createdAt field as a Date object
    return {
      ...todos[todoIndex],
      createdAt: new Date(todos[todoIndex].createdAt),
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
    // Initialize mock todos if not already done
    initializeMockTodos();
    
    // Get existing todos
    const todosJson = localStorage.getItem(TODOS_STORAGE_KEY);
    const todos = JSON.parse(todosJson || '[]');
    
    // Find the todo to delete
    const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    // Check if user is authorized to delete this todo
    if (currentUser.role !== 'admin' && todos[todoIndex].userId !== currentUser.id) {
      throw new Error('Unauthorized to delete this todo');
    }
    
    // Remove the todo from the list
    todos.splice(todoIndex, 1);
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};
