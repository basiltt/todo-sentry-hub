
import { Controller, Get, Post, Body, Param, Patch, Delete, Headers, UnauthorizedException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthService } from '../auth/auth.service';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService,
  ) {}

  // Helper method to validate user from token
  private getUserFromToken(authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  @Get()
  getTodos(@Headers('authorization') authHeader: string) {
    const user = this.getUserFromToken(authHeader);
    return this.todoService.getTodos(user);
  }

  @Post()
  addTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    return this.todoService.addTodo(createTodoDto.text, user);
  }

  @Patch(':id/toggle')
  toggleTodoComplete(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    return this.todoService.toggleTodoComplete(id, user);
  }

  @Patch(':id')
  editTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    return this.todoService.editTodo(id, updateTodoDto.text, user);
  }

  @Delete(':id')
  deleteTodo(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    this.todoService.deleteTodo(id, user);
    return { success: true };
  }
}
