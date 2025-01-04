import { IsDefined, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class TestimonialDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly review: string;

  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  readonly ratings: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly workspaceId: string;
}
