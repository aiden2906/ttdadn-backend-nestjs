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
  small: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  medium: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  large: number;
}

export class SettingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Setting)
  @ValidateNested()
  setting: Setting;
}
