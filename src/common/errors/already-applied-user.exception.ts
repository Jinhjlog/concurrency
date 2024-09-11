import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyAppliedUserException extends HttpException {
  constructor() {
    super('수강 신청이 완료된 사용자입니다.', HttpStatus.CONFLICT);
  }
}
