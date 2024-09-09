import { MockProxy, mock } from 'jest-mock-extended';
import { LectureRepository } from './database/lecture.repository';
import { LectureService } from './lecture.service';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import { UserRepository } from '../user/database/user.repository';
import LectureApplication from './domain/lecture-application';

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

  describe('isApplicationCompleted', () => {
    it('특강 신청 명단에 유저가 있는 경우 true를 반환한다', async () => {
      // Given
      const userId = '1';
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(
        {} as LectureApplication,
      );

      // When
      const result = await service.isApplicationCompleted(userId);

      // Then
      expect(result).toBe(true);
    });

    it('특강 신청 명단에 유저가 없는 경우 false를 반환한다', async () => {
      // Given
      const userId = '1';
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(null);

      // When
      const result = await service.isApplicationCompleted(userId);

      // Then
      expect(result).toBe(false);
    });
  });
});
