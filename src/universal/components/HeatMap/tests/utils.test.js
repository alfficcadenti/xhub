import {defineColorByValue} from '../utils';
import {expect} from 'chai';

describe('defineColorByValue()', () => {
    it('returns color for values above high Threshold (99.99)', () => {
        const color = defineColorByValue(99.991);
        expect(color).to.be.equal('rgb(12, 160, 44, 0.10000000000042633)');
    });

    it('returns color for values above medium Threshold (99.95)', () => {
        const color = defineColorByValue(99.951);
        expect(color).to.be.equal('rgb(255, 191, 0, 0.9204081632653023)');
    });

    it('returns red color for values below medium Threshold (99.95)', () => {
        const color = defineColorByValue(60);
        expect(color).to.be.equal('rgb(255, 0, 0)');
    });

    it('returns default white color when values is not passed', () => {
        const color = defineColorByValue();
        expect(color).to.be.equal('rgb(255, 255, 255)');
    });

    it('returns default white color if values is a string', () => {
        const color = defineColorByValue('test');
        expect(color).to.be.equal('rgb(255, 255, 255)');
    });
});