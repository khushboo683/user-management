import { IsString, IsDate, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  username: string;

  @IsString()
  birthdate: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsDate()
  @IsOptional()
  birthdate?: Date;
}

export class SearchUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minAge?: number;

  @IsInt()
  @Max(120)
  @IsOptional()
  maxAge?: number;
}
