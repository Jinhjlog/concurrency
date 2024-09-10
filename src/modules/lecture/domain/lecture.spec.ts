import Lecture from './lecture';

describe('Lecture', () => {
  describe('isOverCapacity', () => {
    it.each`
      maxCapacity | currentCapacity | expected | description
      ${2}        | ${1}            | ${false} | ${'초과하지 않은 경우'}
      ${2}        | ${2}            | ${true}  | ${'초과한 경우'}
    `(
      '특강 정원 초과 여부를 반환합니다. ($description)',
      ({ maxCapacity, currentCapacity, expected }) => {
        // given
        const lecture = new Lecture({
          id: '1',
          title: 'Test Lecture',
          description: 'Test Description',
          maxCapacity,
          currentCapacity,
          date: new Date(),
          updatedAt: new Date(),
        });

        // when & then
        expect(lecture.isOverCapacity()).toBe(expected);
      },
    );
  });

  describe('increaseCapacity', () => {
    // given
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

      // when
      lecture.increaseCapacity();

      // then
      expect(lecture.currentCapacity).toBe(1);
    });
  });
});
