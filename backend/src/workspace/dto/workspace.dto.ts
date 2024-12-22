import { IsDefined, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class WorkspaceDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly ownerId: string;

  @IsOptional()
  readonly details: string;
}
