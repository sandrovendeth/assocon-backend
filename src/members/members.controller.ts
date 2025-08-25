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
import { MembersService } from './members.service';
import { MembershipType, MemberStatus } from '@prisma/client';

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('status') status?: MemberStatus) {
    return this.membersService.findAll(status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Post()
  async create(@Body() body: {
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
    return this.membersService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
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
    return this.membersService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: MemberStatus },
  ) {
    return this.membersService.updateStatus(id, body.status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
