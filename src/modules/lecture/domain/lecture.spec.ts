import Lecture from './lecture';

describe('Lecture', () => {
  describe('isOverCapacity', () => {
    it('수강 인원이 정원을 초과하면 true를 반환합니다.', () => {
      // Given
      const lecture = new Lecture({
        id: '1',
        title: 'Test Lecture',
        description: 'Test Description',
        maxCapacity: 2,
        currentCapacity: 2,
        date: new Date(),
        updatedAt: new Date(),
      });

      // When & Then
      expect(lecture.isOverCapacity()).toBe(true);
    });
  });

  describe('increaseCapacity', () => {
    // Given
    it('수강 인원을 1 증가시킵니다.', () => {
      const lecture = new Lecture({
        id: '1',
        title: 'Test Lecture',
        description: 'Test Description',
        maxCapacity: 2,
        currentCapacity: 0,
        date: new Date(),
        updatedAt: new Date(),
      });

      // When
      lecture.increaseCapacity();

      // Then
      expect(lecture.currentCapacity).toBe(1);
    });
  });
});
