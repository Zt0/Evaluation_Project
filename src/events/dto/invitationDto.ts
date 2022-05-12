import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InvitationDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
