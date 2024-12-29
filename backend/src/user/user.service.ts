import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment-timezone';  
import axios from 'axios';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    if (data.birthday && typeof data.birthday === 'string') {
      data.birthday = new Date(data.birthday);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10); 
    }
    return this.prisma.user.create({ data });
  }
  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    if (data.birthday && typeof data.birthday === 'string') {
      data.birthday = new Date(data.birthday);
    }
    if (data.password && typeof data.password === 'string') {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  

  @Cron('0 * * * *') // Runs every hour
  // @Cron('* * * * *') // Runs every minute
  async sendBirthdayMessages() {
    const users = await this.getAllUsers();
    const now = moment();
    for (const user of users) {
      const userTime = moment.tz(now, user.timezone); // User's local time
      const birthday = moment.tz(user.birthday, user.timezone).set({
        year: userTime.year(),
      });

      // Check if it's the user's birthday and the time is 9 AM
      if (userTime.isSame(birthday, 'day') && userTime.hour() === 9) {
        let messageId=0;
        try {
          // Check if a message is already created for today
          const existingMessage = await this.prisma.birthdayMessage.findFirst({
            where: {
              userId: user.id,
              timestamp: {
                gte: birthday.startOf('day').toDate(),
                lt: birthday.endOf('day').toDate(),
              },
            },
          });

          if (!existingMessage) {
            // Create a new message entry in the BirthdayMessage table
            const message = `Hey, ${user.firstName} ${user.lastName}, it’s your birthday!`;

            // Save the birthday message as pending
            const birthdayMessage = await this.prisma.birthdayMessage.create({
              data: {
                userId: user.id,
                message: `Hey, ${user.firstName} ${user.lastName}, it’s your birthday!`,
                status: 'pending',
                timestamp: birthday.toDate(),
                retryCount: 0,
              },
            });
            messageId=birthdayMessage.id;

            // Sending the message
            const response = await axios.post('https://email-service.digitalenvision.com.au/send-email', {
              email: `${user.email}`,
              message: message,
            });

            if (response.status === 200) {
              // If successful, update the message status to 'sent'
              await this.prisma.birthdayMessage.update({
                where: { id: messageId },
                data: { status: response.data.status ?? 'sent' },
              });
              console.log(`Message sent to ${user.firstName} ${user.lastName}`);
            } else {
              // If the status code is not 200, mark the status as 'failed'
              await this.prisma.birthdayMessage.update({
                where: { id: messageId },
                data: { status: response.data.status ?? 'failed' },
              });              
            }
          }
        } catch (error) {
          console.log('Error:', error);
          await this.prisma.birthdayMessage.update({
            where: { id: messageId },
            data: { status: 'failed' },
          });
        }
      }
    }
  }

  // Retry failed messages
  @Cron('0 0 * * *') // Runs once a day
  // @Cron('* * * * *') // Runs every minute
  async retryFailedMessages() {
    const failedMessages = await this.prisma.birthdayMessage.findMany({
      where: {
        status: { not: 'sent' },
        retryCount: { lt: 3 }, // Retry up to 3 times
      },
      include: {
        user: true,
      },
    });
    
    for (const message of failedMessages) {
      try {
        const response = await axios.post('https://email-service.digitalenvision.com.au/send-email', {
          email: `${message.user.email}`,
          message: message.message,
        });

        if (response.status === 200) {
          await this.prisma.birthdayMessage.update({
            where: { id: message.id },
            data: { status: response.data.status ?? 'sent' },
          });
        } else {
          throw new Error('Non-200 response from the API');
        }
      } catch (error) {
        console.log('Error:', error);
  
        await this.prisma.birthdayMessage.update({
          where: { id: message.id },
          data: { retryCount: message.retryCount + 1 },
        });
      }
    }
  }  
}
