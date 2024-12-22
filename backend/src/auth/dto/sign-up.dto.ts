import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
