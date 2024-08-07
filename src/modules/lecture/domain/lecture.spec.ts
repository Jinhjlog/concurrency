import Lecture from './lecture';

describe('Lecture', () => {
  describe('isFull', () => {
    it('수강 인원이 정원을 초과하면 true를 반환한다', () => {
      // Given
      const lecture = new Lecture({
        id: '1',
        title: 'Test Lecture',
        description: 'Test Description',
        maxCapacity: 2,
        currentCapacity: 2,
        date: new Date(),
      });

      // When & Then
      expect(lecture.isFull()).toBe(true);
    });
  });

  describe('increaseCapacity', () => {
    // Given
    it('수강 인원을 1 증가시킨다', () => {
      const lecture = new Lecture({
        id: '1',
        title: 'Test Lecture',
        description: 'Test Description',
        maxCapacity: 2,
        currentCapacity: 0,
        date: new Date(),
      });

      // When
      lecture.increaseCapacity();

      // Then
      expect(lecture.currentCapacity).toBe(1);
    });
  });
});
