
import { User } from "./auth";
import { supabase } from "@/integrations/supabase/client";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  userName: string;
  createdAt: Date;
}

// Get auth token from local storage
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Get todos for a user
export const getTodos = async (currentUser: User): Promise<Todo[]> => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    
    // Filter todos based on user role
    const userTodos = currentUser.role === 'admin' 
      ? data 
      : data.filter((todo: Todo) => todo.userId === currentUser.id);
    
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
    const newTodo = {
      text,
      completed: false,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select()
      .single();
      
    if (error) throw error;
    
    // Return the new todo with the createdAt field as a Date object
    return {
      ...data,
      createdAt: new Date(data.createdAt),
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
    // First, get the current todo to check its completed status
    const { data: todo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Check if user is authorized to modify this todo
    if (currentUser.role !== 'admin' && todo.userId !== currentUser.id) {
      throw new Error('Unauthorized to modify this todo');
    }
    
    // Toggle the completion status
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Return the updated todo with the createdAt field as a Date object
    return {
      ...data,
      createdAt: new Date(data.createdAt),
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
    // First, get the current todo to check ownership
    const { data: todo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Check if user is authorized to modify this todo
    if (currentUser.role !== 'admin' && todo.userId !== currentUser.id) {
      throw new Error('Unauthorized to modify this todo');
    }
    
    // Update the todo text
    const { data, error } = await supabase
      .from('todos')
      .update({ text })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Return the updated todo with the createdAt field as a Date object
    return {
      ...data,
      createdAt: new Date(data.createdAt),
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
    // First, get the current todo to check ownership
    const { data: todo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Check if user is authorized to delete this todo
    if (currentUser.role !== 'admin' && todo.userId !== currentUser.id) {
      throw new Error('Unauthorized to delete this todo');
    }
    
    // Delete the todo
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};
