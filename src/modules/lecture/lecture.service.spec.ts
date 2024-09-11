import { MockProxy, mock } from 'jest-mock-extended';
import { LectureRepository } from './database/lecture.repository';
import { LectureService } from './lecture.service';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import { UserRepository } from '../user/database/user.repository';
import LectureApplication from './domain/lecture-application';
import {
  AlreadyAppliedUserException,
  LectureCapacityExceededException,
  NotFoundLectureException,
  NotFoundUserException,
} from '@common/errors';
import { User } from '@prisma/client';
import Lecture from './domain/lecture';

describe('LectureService', () => {
  let lectureRepository: MockProxy<LectureRepository>;
  let lectureApplicationRepository: MockProxy<LectureApplicationRepository>;
  let userRepository: MockProxy<UserRepository>;
  let service: LectureService;

  beforeEach(() => {
    lectureRepository = mock<LectureRepository>();
    lectureApplicationRepository = mock<LectureApplicationRepository>();
    userRepository = mock<UserRepository>();
    service = new LectureService(
      lectureRepository,
      lectureApplicationRepository,
      userRepository,
    );
  });

  describe('apply', () => {
    it('존재하지 않은 사용자는 특강을 신청할 수 없습니다.', async () => {
      // given
      const userId = '1';
      const lectureId = '1';
      userRepository.findById.mockResolvedValueOnce(null);

      // when & then
      await expect(service.apply(userId, lectureId)).rejects.toThrow(
        NotFoundUserException,
      );
    });

    it('존재하지 않는 특강은 신청할 수 없습니다.', async () => {
      // given
      const userId = '1';
      const lectureId = '1';
      userRepository.findById.mockResolvedValueOnce({} as User);
      lectureRepository.findById.mockResolvedValueOnce(null);

      // when & then
      await expect(service.apply(userId, lectureId)).rejects.toThrow(
        NotFoundLectureException,
      );
    });
    it('특강 신청 인원이 초과된 경우 신청할 수 없습니다.', async () => {
      // given
      const userId = '1';
      const lectureId = '1';
      userRepository.findById.mockResolvedValueOnce({} as User);
      lectureRepository.findById.mockResolvedValueOnce(
        new Lecture({
          id: '1',
          title: 'title',
          description: 'description',
          maxCapacity: 1,
          currentCapacity: 1,
          date: new Date(),
          updatedAt: new Date(),
        }),
      );

      // when & then
      await expect(service.apply(userId, lectureId)).rejects.toThrow(
        LectureCapacityExceededException,
      );
    });
    it('특강 신청이 완료된 사용자는 중복으로 신청할 수 없습니다.', async () => {
      // given
      const userId = '1';
      const lectureId = '1';
      userRepository.findById.mockResolvedValueOnce({} as User);
      lectureRepository.findById.mockResolvedValueOnce(
        new Lecture({
          id: '1',
          title: 'title',
          description: 'description',
          maxCapacity: 2,
          currentCapacity: 1,
          date: new Date(),
          updatedAt: new Date(),
        }),
      );
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(
        {} as LectureApplication,
      );

      // when & then
      await expect(service.apply(userId, lectureId)).rejects.toThrow(
        AlreadyAppliedUserException,
      );
    });

    it('특강 신청이 정상적으로 처리되어야 합니다', async () => {
      // given
      const userId = '1';
      const lectureId = '1';
      userRepository.findById.mockResolvedValueOnce({} as User);
      lectureRepository.findById.mockResolvedValueOnce(
        new Lecture({
          id: '1',
          title: 'title',
          description: 'description',
          maxCapacity: 2,
          currentCapacity: 1,
          date: new Date(),
          updatedAt: new Date(),
        }),
      );
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(null);

      // when
      await service.apply(userId, lectureId);

      // then
      expect(lectureRepository.update).toBeCalled();
    });
  });

  describe('isApplicationCompleted', () => {
    // parameterized test
    it.each`
      lectureApplication          | expected | description
      ${null}                     | ${false} | ${'특강 신청 명단에 유저가 존재하지 않습니다.'}
      ${{} as LectureApplication} | ${true}  | ${'특강 신청 명단에 유저가 존재합니다.'}
    `('$description', async ({ lectureApplication, expected }) => {
      // given
      const userId = '1';
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(
        lectureApplication,
      );

      // when
      const result = await service.isApplicationCompleted(userId);

      // then
      expect(result).toBe(expected);
    });
  });
});
