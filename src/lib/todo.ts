
import { User } from "./auth";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  userName: string;
  createdAt: Date;
}

// Mock todos data (temporary until Supabase integration)
let MOCK_TODOS: Todo[] = [
  {
    id: "1",
    text: "Review project requirements",
    completed: false,
    userId: "1", // admin
    userName: "Admin User",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2),
  },
  {
    id: "2",
    text: "Create wireframes",
    completed: true,
    userId: "1", // admin
    userName: "Admin User",
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    id: "3",
    text: "Set up development environment",
    completed: false,
    userId: "2", // regular user
    userName: "Regular User",
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
  {
    id: "4",
    text: "Implement user authentication",
    completed: false,
    userId: "2", // regular user
    userName: "Regular User",
    createdAt: new Date(Date.now() - 3600000 * 6),
  },
];

// Get todos for a user (admins see all, others see only their own)
export const getTodos = async (currentUser: User): Promise<Todo[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (currentUser.role === "admin") {
    // Admin sees all todos
    return [...MOCK_TODOS].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else {
    // Regular user sees only their own todos
    return MOCK_TODOS
      .filter((todo) => todo.userId === currentUser.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
};

// Add a new todo
export const addTodo = async (text: string, currentUser: User): Promise<Todo> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newTodo: Todo = {
    id: Math.random().toString(36).substring(2, 9),
    text,
    completed: false,
    userId: currentUser.id,
    userName: currentUser.name,
    createdAt: new Date(),
  };

  MOCK_TODOS = [newTodo, ...MOCK_TODOS];
  return newTodo;
};

// Toggle todo completion status
export const toggleTodoComplete = async (id: string, currentUser: User): Promise<Todo> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const todoIndex = MOCK_TODOS.findIndex((todo) => todo.id === id);
  
  if (todoIndex === -1) {
    throw new Error("Todo not found");
  }

  // Check if user is admin or the todo belongs to the user
  if (currentUser.role !== "admin" && MOCK_TODOS[todoIndex].userId !== currentUser.id) {
    throw new Error("Unauthorized to modify this todo");
  }

  const updatedTodo = {
    ...MOCK_TODOS[todoIndex],
    completed: !MOCK_TODOS[todoIndex].completed,
  };

  MOCK_TODOS = [
    ...MOCK_TODOS.slice(0, todoIndex),
    updatedTodo,
    ...MOCK_TODOS.slice(todoIndex + 1),
  ];

  return updatedTodo;
};

// Edit a todo
export const editTodo = async (id: string, text: string, currentUser: User): Promise<Todo> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const todoIndex = MOCK_TODOS.findIndex((todo) => todo.id === id);
  
  if (todoIndex === -1) {
    throw new Error("Todo not found");
  }

  // Check if user is admin or the todo belongs to the user
  if (currentUser.role !== "admin" && MOCK_TODOS[todoIndex].userId !== currentUser.id) {
    throw new Error("Unauthorized to modify this todo");
  }

  const updatedTodo = {
    ...MOCK_TODOS[todoIndex],
    text,
  };

  MOCK_TODOS = [
    ...MOCK_TODOS.slice(0, todoIndex),
    updatedTodo,
    ...MOCK_TODOS.slice(todoIndex + 1),
  ];

  return updatedTodo;
};

// Delete a todo
export const deleteTodo = async (id: string, currentUser: User): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const todoIndex = MOCK_TODOS.findIndex((todo) => todo.id === id);
  
  if (todoIndex === -1) {
    throw new Error("Todo not found");
  }

  // Check if user is admin or the todo belongs to the user
  if (currentUser.role !== "admin" && MOCK_TODOS[todoIndex].userId !== currentUser.id) {
    throw new Error("Unauthorized to delete this todo");
  }

  MOCK_TODOS = [
    ...MOCK_TODOS.slice(0, todoIndex),
    ...MOCK_TODOS.slice(todoIndex + 1),
  ];
};
