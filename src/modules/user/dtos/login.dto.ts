import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}

export class ForgotPasswordDtp {
  @ApiProperty()
  @IsDefined()
  @IsString()
  username: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  new_password: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  token: string;
}
