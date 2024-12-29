import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ensure this points to your PrismaService
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    // Find the user by email
    console.log('Email:', email); // Debugging line to check email value
    const user = await this.prisma.user.findFirst({
      where: { email }, // No more type error
    });
  
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
  
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('info:',{
      user: user,
      'user.password': user.password,
      password: password,
      bcrypt: await bcrypt.hash(password, 10),
    })
  
    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
  
    // Exclude sensitive fields
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
