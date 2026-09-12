import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { InterestsModule } from './interests/interests.module.js';
import { UsersModule } from './users/users.module.js';
import { EventsModule } from './events/events.module.js';
import { ClubsModule } from './clubs/clubs.module.js';
import { FeedModule } from './feed/feed.module.js';
import { PostsModule } from './posts/posts.module.js';
import { PaymentsModule } from './payments/payments.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    InterestsModule,
    UsersModule,
    EventsModule,
    ClubsModule,
    FeedModule,
    PostsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
