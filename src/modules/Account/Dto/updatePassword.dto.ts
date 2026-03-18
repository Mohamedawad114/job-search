import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Match } from 'src/common/decorator';
import { ApiProperty } from '@nestjs/swagger';

export class updatePasswordDto {
  @ApiProperty()
  @IsString()
  @Length(8, 64)
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number and special character',
    },
  )
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @Length(8, 64)
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number and special character',
    },
  )
  newPassword: string;

  @ApiProperty()
  @IsString()
  @Length(8, 64)
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number and special character',
    },
  )
  @Match(['newPassword'])
  confirmPassword: string;
}
