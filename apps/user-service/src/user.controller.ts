import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. Listen for RabbitMQ Event
  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any) {
    console.log('Received user_created event:', data);
    return this.userService.createProfile(data);
  }

  // 2. REST Endpoint for Search (CV Requirement)
  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  async search(@Query('q') query: string) {
    return this.userService.searchUsers(query);
  }
}