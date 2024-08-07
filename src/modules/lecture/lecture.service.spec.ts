import { MockProxy, mock } from 'jest-mock-extended';
import { LectureRepository } from './database/lecture.repository';
import { LectureService } from './lecture.service';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRepository } from '../user/database/user.repository';
import LectureApplication from './domain/lecture-application';
import User from '../user/domain/user';
import Lecture from './domain/lecture';

describe('LectureService', () => {
  let lectureRepository: MockProxy<LectureRepository>;
  let lectureApplicationRepository: MockProxy<LectureApplicationRepository>;
  let userRepository: MockProxy<UserRepository>;
  let prismaService: MockProxy<PrismaService>;
  let service: LectureService;

  beforeEach(() => {
    lectureRepository = mock<LectureRepository>();
    lectureApplicationRepository = mock<LectureApplicationRepository>();
    userRepository = mock<UserRepository>();
    prismaService = mock<PrismaService>();
    service = new LectureService(
      prismaService,
      lectureRepository,
      lectureApplicationRepository,
      userRepository,
    );

    prismaService.$transaction.mockImplementation((callback) => {
      return callback(prismaService);
    });
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

  describe('apply', () => {
    it('유저가 존재하지 않는 경우 특강을 신청할 수 없다.', async () => {
      // Given
      const userId = '1';
      const lectureId = '1';
      userRepository.findOne.mockResolvedValueOnce(null);

      // When & Then
      await expect(
        service.applyPessimisticLock({ userId, lectureId }),
      ).rejects.toThrow('User not found');
    });

    it('이미 특강을 신청한 유저는 특강을 신청할 수 없다.', async () => {
      // Given
      const userId = '1';
      const lectureId = '1';
      userRepository.findOne.mockResolvedValueOnce({} as User);
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(
        {} as LectureApplication,
      );

      // When & Then
      await expect(
        service.applyPessimisticLock({ userId, lectureId }),
      ).rejects.toThrow('User already applied');
    });

    it('특강이 존재하지 않을 경우 신청할 수 없다.', async () => {
      // Given
      const userId = '1';
      const lectureId = '1';
      userRepository.findOne.mockResolvedValueOnce({} as User);
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(null);
      lectureRepository.findOneForUpdate.mockResolvedValueOnce(null);

      // When & Then
      await expect(
        service.applyPessimisticLock({ userId, lectureId }),
      ).rejects.toThrow('Lecture not found');
    });

    it('특강 인원이 가득 찼을 경우 신청할 수 없다.', async () => {
      // Given
      const userId = '1';
      const lectureId = '1';
      userRepository.findOne.mockResolvedValueOnce({} as User);
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(null);
      lectureRepository.findOneForUpdate.mockResolvedValueOnce(
        new Lecture({
          id: '1',
          title: 'Test Lecture',
          description: 'Test Description',
          maxCapacity: 2,
          currentCapacity: 2,
          date: new Date(),
          updatedAt: new Date(),
        }),
      );

      // When & Then
      await expect(
        service.applyPessimisticLock({ userId, lectureId }),
      ).rejects.toThrow('Lecture is full');
    });

    it('특강 신청이 처리된다.', async () => {
      // Given
      const userId = '1';
      const lectureId = '1';
      userRepository.findOne.mockResolvedValueOnce({} as User);
      lectureApplicationRepository.findByUserId.mockResolvedValueOnce(null);
      lectureRepository.findOneForUpdate.mockResolvedValueOnce(
        new Lecture({
          id: '1',
          title: 'Test Lecture',
          description: 'Test Description',
          maxCapacity: 2,
          currentCapacity: 0,
          date: new Date(),
          updatedAt: new Date(),
        }),
      );

      // When
      await service.applyPessimisticLock({ userId, lectureId });

      // Then
      expect(
        lectureApplicationRepository.createWithUpdateLecture,
      ).toHaveBeenCalled();
    });
  });
});
