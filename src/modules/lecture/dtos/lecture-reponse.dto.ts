import { ApiProperty } from '@nestjs/swagger';

export class LectureResponseDto {
  @ApiProperty({
    example: 'ulid',
    description: '특강 고유 아이디',
  })
  id: string;

  @ApiProperty({
    example: '특강 제목',
    description: '특강 제목',
  })
  title: string;

  @ApiProperty({
    example: '특강 설명',
    description: '특강 설명',
  })
  description: string;

  @ApiProperty({
    example: 10,
    description: '특강 정원',
  })
  maxCapacity: number;

  @ApiProperty({
    example: 5,
    description: '특강 현재 신청 완료 인원',
  })
  currentCapacity: number;

  @ApiProperty({
    example: new Date(),
    description: '특강 날짜',
  })
  date: Date;
}
