import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FeedService } from './feed.service.js';
import { AuthService } from '../auth/auth.service.js';

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly authService: AuthService,
  ) {}

  /**
   * GET /feed — discovery feed combining events and clubs.
   * If the caller provides an authenticated session header, items matching
   * their saved interests will be ranked first with matched interest tags.
   */
  @Get()
  async getFeed(@Req() req: Request) {
    let userId: string | undefined = (req as any)?.user?.id;

    if (!userId) {
      try {
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers || {})) {
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

        const sessionResult = await this.authService.getSession(headers);
        if (sessionResult?.user?.id) {
          userId = sessionResult.user.id;
        }
      } catch {
        userId = undefined;
      }
    }

    const queryInterestIds =
      typeof req.query.interestIds === 'string'
        ? req.query.interestIds.split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(req.query.interestIds)
        ? (req.query.interestIds as string[])
        : undefined;

    const queryInterestNames =
      typeof req.query.interests === 'string'
        ? req.query.interests.split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(req.query.interests)
        ? (req.query.interests as string[])
        : undefined;

    return this.feedService.getFeed(userId, queryInterestIds, queryInterestNames);
  }
}
