import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts — public listing of all student posts & teammate requests
   */
  @Get()
  async getPosts() {
    return this.postsService.findAll();
  }

  /**
   * POST /posts — create a new student post / teammate request
   */
  @Post()
  async createPost(
    @Body() body: any,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const authorId = user?.id || 'seed-organizer-user';
    return this.postsService.create(body, authorId);
  }
}
