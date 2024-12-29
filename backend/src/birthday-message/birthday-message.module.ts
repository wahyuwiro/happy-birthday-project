import { Module } from '@nestjs/common';
import { BirthdayMessageController } from './birthday-message.controller';
import { BirthdayMessageService } from './birthday-message.service';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService

@Module({
  controllers: [BirthdayMessageController],
  providers: [BirthdayMessageService, PrismaService], // Include PrismaService here
})
export class BirthdayMessageModule {}
