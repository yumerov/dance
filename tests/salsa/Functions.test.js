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
});