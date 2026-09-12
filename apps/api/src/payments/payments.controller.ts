import {
  Body,
  Controller,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service.js';
import { AuthService } from '../auth/auth.service.js';

@Controller('events')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Helper to extract authenticated user from Better Auth session headers,
   * falling back to the seed demo organizer user if unauthenticated.
   */
  private async getUserIdFromRequest(req: Request): Promise<string> {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          for (const v of value) {
            headers.append(key, v);
          }
        } else {
          headers.set(key, value);
        }
      }
    }

    const session = await this.authService.getSession(headers);
    return session?.user?.id || 'seed-organizer-user';
  }

  /**
   * POST /events/:id/payment/order
   * Create Razorpay order for paid events, or direct register for free events.
   */
  @Post(':id/payment/order')
  async createPaymentOrder(
    @Param('id') eventId: string,
    @Req() req: Request,
  ) {
    const userId = await this.getUserIdFromRequest(req);
    return this.paymentsService.createOrder(eventId, userId);
  }

  /**
   * POST /events/:id/payment/verify
   * Verify cryptographic Razorpay signature and lock confirmed registration in PostgreSQL.
   */
  @Post(':id/payment/verify')
  async verifyPayment(
    @Param('id') eventId: string,
    @Body()
    body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
    @Req() req: Request,
  ) {
    const userId = await this.getUserIdFromRequest(req);
    return this.paymentsService.verifyPayment(eventId, userId, body);
  }
}
