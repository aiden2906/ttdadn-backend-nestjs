import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { StatusControl, STATUS_CONTROL } from '../control.constant';

export class ControlDeviceDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  level: number;
}

export class ControlDeviceCreateDto extends ControlDeviceDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  id: string;
}
export class ControlDeviceUpdateDto extends ControlDeviceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  level: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(STATUS_CONTROL)
  status_device: StatusControl;
}
