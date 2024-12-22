import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { WorkspaceService } from 'src/workspace/services/workspace.service';

@Module({
  providers: [UserService, PrismaService, WorkspaceService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
