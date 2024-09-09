import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends HttpException {
  constructor() {
    super('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  }
}
