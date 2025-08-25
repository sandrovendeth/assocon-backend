import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PostCategory } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(published?: boolean) {
    return this.databaseService.post.findMany({
      where: published !== undefined ? { published } : {},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.databaseService.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.databaseService.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    category: PostCategory;
    imageUrl?: string;
    authorId: string;
    published?: boolean;
  }) {
    return this.databaseService.post.create({
      data: {
        ...data,
        publishedAt: data.published ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      slug?: string;
      category?: PostCategory;
      imageUrl?: string;
      published?: boolean;
    },
  ) {
    const updateData: any = { ...data };

    if (data.published !== undefined) {
      updateData.publishedAt = data.published ? new Date() : null;
    }

    return this.databaseService.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.databaseService.post.delete({
      where: { id },
    });
  }
}
