import { calculateDirectionType, DIRECTION_TYPE } from '../compareXandYDirections';

describe('test compareXandYDirection', () => {
    it(`should return Y when its the biggest`, () => {
        expect(calculateDirectionType({ deltaX: 20, deltaY: 25})).toBe(DIRECTION_TYPE.Y);
    })

    it(`should return X when its absolute value is the biggest`, () => {
        expect(calculateDirectionType({ deltaX: -40, deltaY: 25})).toBe(DIRECTION_TYPE.X);
    })
})