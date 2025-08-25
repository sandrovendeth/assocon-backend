import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MembershipType, MemberStatus } from '@prisma/client';

@Injectable()
export class MembersService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(status?: MemberStatus) {
    return this.databaseService.member.findMany({
      where: status ? { status } : {},
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.databaseService.member.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    profession?: string;
    company?: string;
    membershipType?: MembershipType;
  }) {
    return this.databaseService.member.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      cpf?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      profession?: string;
      company?: string;
      membershipType?: MembershipType;
      status?: MemberStatus;
    },
  ) {
    return this.databaseService.member.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: MemberStatus) {
    return this.databaseService.member.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.databaseService.member.delete({
      where: { id },
    });
  }
}
