import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (newWorkspace) {
      return {
        newWorkspace,
        message: `${newWorkspace.name} has been successfully added to your workspaces`,
      };
    }
    return null;
  }

  async getWorkspaces() {
    return await this.prismaService.workspace.findMany();
  }

  async getWorkspaceById(id: string) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: {
        id,
      },
    });
    if (!workspace) {
      throw new NotFoundException('Cannot find a workspace with the given id');
    }
    return workspace;
  }

  async updateWorkspace(id: string, workspaceDto: WorkspaceDto) {
    const existingWorkspace = await this.prismaService.workspace.findUnique({
      where: {
        id,
      },
    });
    if (!existingWorkspace) {
      throw new NotFoundException('Cannot find a workspace');
    }
    const updatedWorkspace = await this.prismaService.workspace.update({
      where: {
        id,
      },
      data: workspaceDto,
    });
    return {
      updatedWorkspace,
      message: `Successfully updated ${updatedWorkspace.name}`,
    };
  }

  async deleteWorkspace(id: string) {
    const isWorkspaceExists = this.prismaService.workspace.findUnique({
      where: {
        id,
      },
    });
    if (!isWorkspaceExists) {
      throw new NotFoundException("Couldn't find the workspace");
    }
    await this.prismaService.workspace.delete({
      where: { id },
    });

    return { message: 'Workspace deleted successfully' };
  }
}
