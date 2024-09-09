import { HttpException, HttpStatus } from '@nestjs/common';

export class LectureCapacityExceededException extends HttpException {
  constructor() {
    super('강의 수용 인원이 초과되었습니다.', HttpStatus.CONFLICT);
  }
}
