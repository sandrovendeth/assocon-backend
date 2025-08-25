import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('read') read?: string) {
    const isRead = read === 'true' ? true : read === 'false' ? false : undefined;
    return this.contactService.findAll(isRead);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Post()
  async create(@Body() body: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    return this.contactService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/unread')
  async markAsUnread(@Param('id') id: string) {
    return this.contactService.markAsUnread(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
