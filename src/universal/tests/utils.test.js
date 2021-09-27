import {expect} from 'chai';
import {getOrDefault} from '../utils';

describe('getOrDefault()', () => {
    it('getOrDefault', () => {
        expect(getOrDefault()).to.eql('-');
        expect(getOrDefault(null, null)).to.eql('-');
        expect(getOrDefault({a: 'hello'}, 'b')).to.eql('-');
        expect(getOrDefault({a: 'hello'}, 'a')).to.eql('hello');
        expect(getOrDefault({a: 'hello'}, 'a', (x) => `${x}!`)).to.eql('hello!');
        expect(getOrDefault({a: 'hello'}, 'a', (x, y) => `${x}${y}`, '!!')).to.eql('hello!!');
        expect(getOrDefault({a: 'hello'}, 'a', () => null, null)).to.eql('-');
        expect(getOrDefault({a: ''}, 'a')).to.eql('-');
    });
});
