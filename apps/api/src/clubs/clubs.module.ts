import { Module } from '@nestjs/common';
import { ClubsController } from './clubs.controller.js';
import { ClubsService } from './clubs.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
