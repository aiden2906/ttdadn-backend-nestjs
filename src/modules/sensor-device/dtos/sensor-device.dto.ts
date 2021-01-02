import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';
import { STATUS_SENSOR, StatusSensor } from '../sensor.constant';

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
export class SensorDeviceUpdateDto extends SensorDeviceDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temp: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  humi: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(STATUS_SENSOR)
  status_device: StatusSensor;
}
