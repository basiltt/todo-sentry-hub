
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Todo } from './todo.model';
import { UserDto } from '../auth/user.model';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    {
      id: '1',
      text: 'Review project requirements',
      completed: false,
      userId: '1', // admin
      userName: 'Admin User',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2),
    },
    {
      id: '2',
      text: 'Create wireframes',
      completed: true,
      userId: '1', // admin
      userName: 'Admin User',
      createdAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      id: '3',
      text: 'Set up development environment',
      completed: false,
      userId: '2', // regular user
      userName: 'Regular User',
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
    {
      id: '4',
      text: 'Implement user authentication',
      completed: false,
      userId: '2', // regular user
      userName: 'Regular User',
      createdAt: new Date(Date.now() - 3600000 * 6),
    },
  ];

  getTodos(currentUser: UserDto): Todo[] {
    // Admin sees all todos, others see only their own
    if (currentUser.role === 'admin') {
      return [...this.todos].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      return this.todos
        .filter((todo) => todo.userId === currentUser.id)
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }

  addTodo(text: string, currentUser: UserDto): Todo {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date(),
    };

    this.todos.unshift(newTodo);
    return newTodo;
  }

  toggleTodoComplete(id: string, currentUser: UserDto): Todo {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    
    if (todoIndex === -1) {
      throw new NotFoundException('Todo not found');
    }

    // Check if user is admin or the todo belongs to the user
    if (currentUser.role !== 'admin' && this.todos[todoIndex].userId !== currentUser.id) {
      throw new ForbiddenException('Unauthorized to modify this todo');
    }

    const updatedTodo = {
      ...this.todos[todoIndex],
      completed: !this.todos[todoIndex].completed,
    };

    this.todos = [
      ...this.todos.slice(0, todoIndex),
      updatedTodo,
      ...this.todos.slice(todoIndex + 1),
    ];

    return updatedTodo;
  }

  editTodo(id: string, text: string, currentUser: UserDto): Todo {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    
    if (todoIndex === -1) {
      throw new NotFoundException('Todo not found');
    }

    // Check if user is admin or the todo belongs to the user
    if (currentUser.role !== 'admin' && this.todos[todoIndex].userId !== currentUser.id) {
      throw new ForbiddenException('Unauthorized to modify this todo');
    }

    const updatedTodo = {
      ...this.todos[todoIndex],
      text,
    };

    this.todos = [
      ...this.todos.slice(0, todoIndex),
      updatedTodo,
      ...this.todos.slice(todoIndex + 1),
    ];

    return updatedTodo;
  }

  deleteTodo(id: string, currentUser: UserDto): void {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    
    if (todoIndex === -1) {
      throw new NotFoundException('Todo not found');
    }

    // Check if user is admin or the todo belongs to the user
    if (currentUser.role !== 'admin' && this.todos[todoIndex].userId !== currentUser.id) {
      throw new ForbiddenException('Unauthorized to delete this todo');
    }

    this.todos = [
      ...this.todos.slice(0, todoIndex),
      ...this.todos.slice(todoIndex + 1),
    ];
  }
}
