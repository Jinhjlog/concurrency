import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { LectureResponseDto } from './dtos/lecture-reponse.dto';
import { LectureApplicationDto } from './dtos';
import { LectureAssembler } from './lecture.assembler';

@ApiTags('특강')
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiOperation({
    summary: '특강 신청',
    description:
      '선착순으로 제공되는 특강을 신청하는 API를 제공합니다. <br> 동일한 신청자는 한 번의 수강 신청만 성공할 수 있습니다.',
  })
  @ApiCreatedResponse({
    description: '특강 신청 성공',
  })
  @Post('/apply')
  async create(
    @Body() { userId, lectureId }: LectureApplicationDto,
  ): Promise<void> {
    await this.lectureService.apply(userId, lectureId);
  }

  @ApiOperation({
    summary: '특강 목록 조회',
    description: '전체 특강 목록을 조회하는 API를 제공합니다.',
  })
  @ApiOkResponse({
    description: '특강 목록 조회 성공',
    type: [LectureResponseDto],
  })
  @Get()
  async findAll(): Promise<LectureResponseDto[]> {
    const lectures = await this.lectureService.findAll();

    return lectures.map(LectureAssembler.toResponse);
  }

  @ApiOperation({
    summary: '특강 신청 완료 여부 조회 API',
    description: '특강 신청 완료 여부를 조회하는 API를 제공합니다.',
  })
  @ApiOkResponse({
    description: '특강 신청 완료 여부 조회 성공',
    type: Boolean,
  })
  @Get('/application/:userId')
  findOne(@Param('userId') userId: string): Promise<boolean> {
    return this.lectureService.isApplicationCompleted(userId);
  }
}
