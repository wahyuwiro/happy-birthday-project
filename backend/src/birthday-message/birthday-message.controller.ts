import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { BirthdayMessageService } from './birthday-message.service';

@Controller('birthday-messages')
export class BirthdayMessageController {
  constructor(private readonly birthdayMessageService: BirthdayMessageService) {}

  // Create a new birthday message
  @Post()
  async createMessage(
    @Body('userId') userId: number,
    @Body('message') message: string,
    @Body('timestamp') timestamp: string, // Accepting timestamp as a string and parsing it
  ) {
    const timestampDate = new Date(timestamp);
    return await this.birthdayMessageService.createMessage(userId, message, timestampDate);
  }

  // Update message status (e.g., mark as 'sent')
  @Patch(':id/status')
  async updateMessageStatus(@Param('id') id: number, @Body('status') status: string) {
    return await this.birthdayMessageService.updateMessageStatus(id, status);
  }
}
