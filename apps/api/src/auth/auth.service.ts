import { Injectable } from '@nestjs/common';
import { auth } from '../lib/auth.js';

@Injectable()
export class AuthService {
  private readonly auth = auth;

  /**
   * Handle Better Auth API requests.
   * Better Auth expects standard Request/Response objects.
   */
  async handleRequest(request: Request): Promise<Response> {
    return this.auth.handler(request);
  }

  /**
   * Get the current session from a request.
   * Returns null if the request is not authenticated.
   */
  async getSession(headers: Headers) {
    return this.auth.api.getSession({ headers });
  }
}
