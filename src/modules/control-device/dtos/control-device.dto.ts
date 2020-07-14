import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

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
export class ControlDeviceUpdateDto extends ControlDeviceDto {}
