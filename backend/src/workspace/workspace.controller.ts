import { Body, Controller, Post } from '@nestjs/common';
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
}
