export enum DomainExceptionCode {
  INVALID_INPUT = 'INVALID_INPUT',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
}

export default class DomainException extends Error {
  code: DomainExceptionCode;

  constructor(code: DomainExceptionCode, message?: string) {
    super(message);
    this.code = code;
    this.name = 'DomainException';
  }

  static invalidInput(message: string): DomainException {
    return new DomainException(DomainExceptionCode.INVALID_INPUT, message);
  }

  static resourceNotFound(message: string): DomainException {
    return new DomainException(DomainExceptionCode.RESOURCE_NOT_FOUND, message);
  }
}