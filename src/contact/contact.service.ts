import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ContactService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(read?: boolean) {
    return this.databaseService.contactMessage.findMany({
      where: read !== undefined ? { read } : {},
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.databaseService.contactMessage.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    return this.databaseService.contactMessage.create({
      data,
    });
  }

  async markAsRead(id: string) {
    return this.databaseService.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAsUnread(id: string) {
    return this.databaseService.contactMessage.update({
      where: { id },
      data: { read: false },
    });
  }

  async remove(id: string) {
    return this.databaseService.contactMessage.delete({
      where: { id },
    });
  }
}
