import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundLectureException extends HttpException {
  constructor() {
    super('강의를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  }
}
