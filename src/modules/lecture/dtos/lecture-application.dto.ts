import { ApiProperty } from '@nestjs/swagger';

export class LectureApplicationDto {
  @ApiProperty({
    example: 'ulid',
    description: '유저 고유 아이디',
  })
  userId: string;

  @ApiProperty({
    example: 'ulid',
    description: '특강 고유 아이디',
  })
  lectureId: string;
}
