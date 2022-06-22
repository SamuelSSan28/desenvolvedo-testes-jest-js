import { queryString, parse } from './queryString';

describe('Object to query string', () => {
    it('should create a valid query string when a object is valid', () => {
        const obj = { name: 'Fabio', profession: 'developer' };

        expect(queryString(obj)).toBe('name=Fabio&profession=developer');
    });

    it('should create a valid query string even when an array is passed as valu', () => {
        const obj = { name: 'Fabio', abilitites: ['js', 'html', 'css'] };

        expect(queryString(obj)).toBe('name=Fabio&abilitites=js,html,css');
    });

    it('should create a valid query string even when an array is passed as valu', () => {
        const obj = {
            name: 'Fabio',
            abilitites: { first: 'js', second: 'python' },
        };

        expect(() => {
            queryString(obj);
        }).toThrowError();
    });
});

describe('Query String to object', () => {
    it('should convert a query string to object', () => {
        const qs = 'name=Fabio&profession=developer';
        expect(parse(qs)).toEqual({ name: 'Fabio', profession: 'developer' });
    });

    it('should convert a query string of a single key-value par to object', () => {
        const qs = 'name=Fabio';
        expect(parse(qs)).toEqual({ name: 'Fabio' });
    });

    it('should convert a query string to object taking care of a comma separated values', () => {
        const qs = 'name=Fabio&abilitities=js,tdd';
        expect(parse(qs)).toEqual({ name: 'Fabio', abilitities: ['js', 'tdd'] });
    });
});
