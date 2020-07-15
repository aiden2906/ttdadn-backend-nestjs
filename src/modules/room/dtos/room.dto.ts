import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional, IsArray } from 'class-validator';

class RoomDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  devices: string[];
}

export class RoomCreateDto extends RoomDto {}
