import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceDto } from './dto/workspace.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}
  @Post('create')
  async createWorkspace(
    @Body()
    workspaceDto: WorkspaceDto,
  ) {
    return this.workspaceService.createWorkspace(workspaceDto);
  }

  @Get('get-all')
  async getWorkspaces() {
    return this.workspaceService.getWorkspaces();
  }

  @Get('get-one')
  async getWorkspaceById(@Body() id: string) {
    return this.workspaceService.getWorkspaceById(id);
  }

  @Delete('delete')
  async deleteWorkspace(@Body() id: string) {
    return this.workspaceService.deleteWorkspace(id);
  }
}
