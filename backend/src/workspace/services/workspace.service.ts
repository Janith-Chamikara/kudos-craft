import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspaceDto } from '../dto/workspace.dto';
import { Workspace } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaService: PrismaService) {}

  async createWorkspace(workspaceDto: WorkspaceDto) {
    const isWorkspaceWithSameNameExists =
      await this.prismaService.workspace.findFirst({
        where: {
          name: workspaceDto.name,
          ownerId: workspaceDto.ownerId,
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

  async getWorkspacesByUserId(
    id: string,
    filters?: { dateRange?: { from: Date; to: Date }; searchQuery?: string },
  ) {
    if (!id) {
      throw new NotFoundException("Couldn't find a user id");
    }

    const whereClause: any = { ownerId: id };

    if (filters?.dateRange) {
      whereClause.createdAt = {
        gte: filters.dateRange.from,
        lte: filters.dateRange.to,
      };
    }

    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      whereClause.OR = [{ name: { contains: searchLower } }];
    }

    const workspaces = await this.prismaService.workspace.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return workspaces;
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

  async updateWorkspace(id: string, updatedContent: Partial<Workspace>) {
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
      data: updatedContent,
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
    await this.prismaService.testimonial.deleteMany({
      where: {
        workspaceId: id,
      },
    });
    await this.prismaService.workspace.delete({
      where: { id },
    });

    return { message: 'Workspace deleted successfully' };
  }

  async getWorkspaceStats(userId: string) {
    const count = await this.prismaService.workspace.count({
      where: {
        ownerId: userId,
      },
    });
    return { count };
  }

  async getAllWorkspaceStats() {
    const count = await this.prismaService.workspace.count();
    return { count };
  }
}
