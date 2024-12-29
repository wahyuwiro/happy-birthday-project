import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BirthdayMessage } from '@prisma/client';
import { Prisma } from '@prisma/client'; // Import the Prisma Client types

@Injectable()
export class BirthdayMessageService {
  constructor(private prisma: PrismaService) {}

  // Create a new birthday message
  async createMessage(userId: number, message: string, timestamp: Date) {
    return await this.prisma.birthdayMessage.create({
      data: {
        userId,
        message,
        status: 'pending', // Initial status
        timestamp,
        retryCount: 0,
      },
    });
  }

  // Fetch all birthday messages for a user
  async getMessagesByUserId(userId: number): Promise<BirthdayMessage[]> {
    return await this.prisma.birthdayMessage.findMany({
      where: {
        userId,
      },
    });
  }

  // Update the status of a message (e.g., mark it as 'sent')
  async updateMessageStatus(id: number, status: string) {
    return await this.prisma.birthdayMessage.update({
      where: { id },
      data: { status },
    });
  }

  // Retry sending a failed message
  async retrySendingMessage(id: number) {
    const message = await this.prisma.birthdayMessage.findUnique({
      where: { id },
    });
    if (message && message.retryCount < 3) {
      await this.prisma.birthdayMessage.update({
        where: { id },
        data: { retryCount: message.retryCount + 1 },
      });
    }
  }
}
