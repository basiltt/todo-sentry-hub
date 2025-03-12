
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import TodoList from "@/components/todos/TodoList";
import TodoForm from "@/components/todos/TodoForm";
import { useAuth } from "@/lib/auth";
import { getTodos, addTodo, toggleTodoComplete, editTodo, deleteTodo, Todo } from "@/lib/todo";
import { useToast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const fetchedTodos = await getTodos(user);
        setTodos(fetchedTodos);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        toast({
          variant: "destructive",
          title: "Failed to load tasks",
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [user, toast]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleAddTodo = async (text: string) => {
    if (!user) return;
    
    try {
      setIsAdding(true);
      const newTodo = await addTodo(text, user);
      setTodos([newTodo, ...todos]);
      toast({
        title: "Task added",
        description: "Your new task has been created.",
      });
    } catch (error) {
      console.error("Failed to add todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to add task",
        description: "Please try again.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    if (!user) return;
    
    try {
      const updatedTodo = await toggleTodoComplete(id, user);
      setTodos(
        todos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const handleEditTodo = async (id: string, text: string) => {
    if (!user) return;
    
    try {
      const updatedTodo = await editTodo(id, text, user);
      setTodos(
        todos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to edit todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteTodo(id, user);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: "Task deleted",
        description: "Your task has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Tasks</h1>
            <div className="text-sm px-3 py-1 bg-secondary dark:bg-accent rounded-full">
              {isAdmin ? "Admin view" : "Personal view"}
            </div>
          </div>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "As an admin, you can see and manage all tasks from all users."
              : "Manage your personal tasks and keep track of your progress."}
          </p>
        </div>

        <TodoForm onAdd={handleAddTodo} isLoading={isAdding} />
        
        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
