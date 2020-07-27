import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Setting {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  upper: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  lower: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  val: number;
}

export class SettingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Setting)
  @ValidateNested()
  setting: Setting;
}
