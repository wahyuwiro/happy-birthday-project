import { Controller, Post, Body, Delete, Param, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() body) {
    return this.userService.createUser(body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(+id);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(+id);    
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() body) {
    return this.userService.updateUser(+id, body);
  }
}
