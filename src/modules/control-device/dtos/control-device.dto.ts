import { ApiProperty } from '@nestjs/swagger';

export class ControlDeviceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  level: number;
}

export class ControlDeviceCreateDto extends ControlDeviceDto {}
