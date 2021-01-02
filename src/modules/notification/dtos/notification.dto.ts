import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

class NotificationDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  device_id: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class NotificationCreateDto extends NotificationDto {}
