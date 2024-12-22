import { IsDefined, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { EmployeeCount, Usage } from 'src/utils/types';

export class AccountSetupDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly usage: Usage;

  @IsOptional()
  readonly jobField: string;

  @IsOptional()
  readonly companyName: string;

  @IsOptional()
  readonly industryType: string;

  @IsOptional()
  readonly numberOfEmployees: EmployeeCount;

  @IsOptional()
  workspace: {
    name: string;
    description: string;
  };
}
