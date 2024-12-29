import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BirthdayMessageService } from './birthday-message/birthday-message.service';
import { BirthdayMessageController } from './birthday-message/birthday-message.controller';
import { BirthdayMessageModule } from './birthday-message/birthday-message.module';

@Module({
  imports: [PrismaModule, UserModule, ScheduleModule.forRoot(), AuthModule, BirthdayMessageModule,],
  controllers: [AppController, BirthdayMessageController],
  providers: [AppService, PrismaService, BirthdayMessageService],
})
export class AppModule {}
