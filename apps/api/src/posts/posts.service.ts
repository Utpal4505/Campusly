import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Return all community posts & teammate requests.
   */
  async findAll() {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            department: true,
          },
        },
      },
    });

    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      author: {
        id: p.author.id,
        name: p.author.name,
      },
      createdAt: p.createdAt,
    }));
  }

  /**
   * Create a new community post or teammate request.
   */
  async create(
    data: {
      title: string;
      content?: string | null;
    },
    authorId: string,
  ) {
    const post = await this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content || null,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.name,
      },
      createdAt: post.createdAt,
    };
  }
}
