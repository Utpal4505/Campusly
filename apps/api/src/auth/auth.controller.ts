import {
  All,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './guards/auth.guard.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Catch-all route that proxies all /api/auth/* requests to Better Auth.
   * Better Auth handles: sign-up, sign-in, sign-out, session, etc.
   */
  @All('*path')
  async handleAuth(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const url = new URL(
      req.originalUrl,
      `${req.protocol}://${req.get('host')}`,
    );

    // Convert Express request to standard Request for Better Auth
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

    const body = ['GET', 'HEAD'].includes(req.method)
      ? undefined
      : JSON.stringify(req.body);

    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    const webResponse = await this.authService.handleRequest(webRequest);

    // Convert standard Response back to Express response
    webResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'set-cookie') {
        res.setHeader(key, value);
      }
    });

    // Forward ALL Set-Cookie headers as an array to prevent Express from overwriting them
    const setCookies =
      typeof (webResponse.headers as any).getSetCookie === 'function'
        ? (webResponse.headers as any).getSetCookie()
        : [];

    if (setCookies.length > 0) {
      res.setHeader('set-cookie', setCookies);
    }
    res.status(webResponse.status);

    const responseBody = await webResponse.text();
    res.send(responseBody);
  }
}

@Controller('auth')
export class AuthMeController {
  constructor(private readonly authService: AuthService) {}

  /**
   * GET /auth/me — returns the current authenticated user.
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: Request) {
    // AuthGuard attaches user and session to req
    return {
      user: (req as any).user,
      session: (req as any).session,
    };
  }
}
