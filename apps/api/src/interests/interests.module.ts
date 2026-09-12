import { Module } from '@nestjs/common';
import { InterestsController } from './interests.controller.js';
import { InterestsService } from './interests.service.js';

@Module({
  controllers: [InterestsController],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}
