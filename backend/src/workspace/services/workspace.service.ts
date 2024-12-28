import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspaceDto } from '../dto/workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaService: PrismaService) {}

  async createWorkspace(workspaceDto: WorkspaceDto) {
    const isWorkspaceWithSameNameExists =
      await this.prismaService.workspace.findFirst({
        where: {
          name: workspaceDto.name,
        },
      });
    if (isWorkspaceWithSameNameExists) {
      throw new BadRequestException(
        'Workspace with the same name already exists in your account',
      );
    }
    const newWorkspace = await this.prismaService.workspace.create({
      data: workspaceDto,
    });
    if (newWorkspace) return newWorkspace;
    return null;
  }
}
