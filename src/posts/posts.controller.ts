import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { PostCategory } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(@Query('published') published?: string) {
    const isPublished = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.postsService.findAll(isPublished);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() body: {
      title: string;
      content: string;
      excerpt?: string;
      slug: string;
      category: PostCategory;
      imageUrl?: string;
      published?: boolean;
    },
    @Request() req,
  ) {
    return this.postsService.create({
      ...body,
      authorId: req.user.id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
      title?: string;
      content?: string;
      excerpt?: string;
      slug?: string;
      category?: PostCategory;
      imageUrl?: string;
      published?: boolean;
    },
  ) {
    return this.postsService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
