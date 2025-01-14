import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceDto } from './dto/workspace.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}
  @Post('create')
  async createWorkspaceHandler(
    @Body()
    workspaceDto: WorkspaceDto,
  ) {
    return this.workspaceService.createWorkspace(workspaceDto);
  }

  @Get('get-all')
  async getWorkspacesHandler() {
    return this.workspaceService.getWorkspaces();
  }

  @Post('/user/get-all')
  async getWorkspacesByUserIdHandler(
    @Query('userId') userId: string,
    @Body()
    filters: {
      dateRange?: {
        from: Date;
        to: Date;
      };
      searchQuery?: string;
    },
  ) {
    return this.workspaceService.getWorkspacesByUserId(userId, filters);
  }

  @Get('get-one')
  async getWorkspaceByIdHandler(@Query('workspaceId') workspaceId: string) {
    return this.workspaceService.getWorkspaceById(workspaceId);
  }

  @Delete('delete')
  async deleteWorkspaceHandler(@Query('workspaceId') workspaceId: string) {
    return this.workspaceService.deleteWorkspace(workspaceId);
  }

  @Get('get-stats')
  async getWorkspaceStatsHandler(@Query('userId') userId: string) {
    return this.workspaceService.getWorkspaceStats(userId);
  }
}
