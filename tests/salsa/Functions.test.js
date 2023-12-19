const { Functions } = require('../../src/salsa/app');

describe(Functions.name, () => {
    describe(Functions.getActiveFigures.name, () => {
        test('with all false', () => {
            const result = Functions.getActiveFigures({
                'notok': false,
                'notok2': false
            });

            expect(result).toHaveLength(0);
        })

        test('with false and true', () => {
            const result = Functions.getActiveFigures({
                'ok': true,
                'notok': false
            });

            expect(result).toHaveLength(1);
            expect(result[0]).toBe('ok');
        })

        test('with all true', () => {
            const result = Functions.getActiveFigures({
                'ok': true,
                'ok2': true
            });

            expect(result).toHaveLength(2);
            expect(result[0]).toBe('ok');
            expect(result[1]).toBe('ok2');
        })
    });

    describe(Functions.getRandomElement.name, () => {
        test('no values', () => {
            expect(Functions.getRandomElement([])).toBeNull();
        });

        test('single value', () => {
            const value = 2;
            for (let index = 0; index < 100; index++) {
                expect(Functions.getRandomElement([value])).toBe(value);
            }
        });

        test('multiple values', () => {
            const values = [1, 2, 3];
            for (let index = 0; index < 100; index++) {
                expect(values.includes(Functions.getRandomElement(values))).toBeTruthy();
            }
        });
    });
});