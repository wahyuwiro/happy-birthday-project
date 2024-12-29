import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    // Find the user by email
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
  
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
  
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
  
    // Exclude sensitive fields
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
