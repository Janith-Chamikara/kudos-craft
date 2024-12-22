import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './services/workspace.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, PrismaService],
})
export class WorkspaceModule {}
