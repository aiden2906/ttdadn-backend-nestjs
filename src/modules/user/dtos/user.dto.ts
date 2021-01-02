import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional, IsBoolean } from 'class-validator';

class UserDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  email: string;
}

export class UserCreateDto extends UserDto {}
export class UserUpdateDto extends UserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  about: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
