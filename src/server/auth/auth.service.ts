
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ token: string; user: UserDto }> {
    const user = this.userService.findByEmail(loginDto.email);
    
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password, ...userDto } = user;
    
    return {
      token,
      user: userDto,
    };
  }

  async register(registerDto: RegisterDto): Promise<{ token: string; user: UserDto }> {
    // Check if user already exists
    const existingUser = this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }

    // Create new user
    const newUser = this.userService.create(
      registerDto.email,
      registerDto.password,
      registerDto.name
    );

    const token = this.jwtService.sign({ 
      sub: newUser.id, 
      email: newUser.email,
      role: newUser.role,
    });

    // Remove password from response
    const { password, ...userDto } = newUser;
    
    return {
      token,
      user: userDto,
    };
  }

  validateToken(token: string): UserDto | null {
    try {
      const payload = this.jwtService.verify(token);
      const user = this.userService.findById(payload.sub);
      
      if (!user) return null;
      
      // Remove password from response
      const { password, ...userDto } = user;
      return userDto;
    } catch (e) {
      return null;
    }
  }
}
