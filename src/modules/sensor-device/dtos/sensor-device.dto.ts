import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

class SensorDeviceDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  temp: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  humi: number;
}

export class SensorDeviceCreateDto extends SensorDeviceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id: string;
}
export class SensorDeviceUpdateDto extends SensorDeviceDto {}
