import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LectureResponseDto } from './dtos/lecture-reponse.dto';
import { LectureApplicationDto } from './dtos';

@ApiTags('특강')
@Controller('lectures')
export class LectureController {
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
    throw new Error('Not implemented');
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
    throw new Error('Not implemented');
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
    throw new Error('Not implemented');
  }
}
