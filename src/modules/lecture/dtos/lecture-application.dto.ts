import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LectureApplicationDto {
  @ApiProperty({
    example: 'ulid',
    description: '유저 고유 아이디',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'ulid',
    description: '특강 고유 아이디',
  })
  @IsString()
  lectureId: string;
}
