import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController, AuthMeController } from './auth.controller.js';
import { AuthGuard } from './guards/auth.guard.js';

@Module({
  controllers: [AuthController, AuthMeController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
