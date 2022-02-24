import React from 'react';
import {expect} from 'chai';
import {getCellStringValue, stringNumComparator} from '../utils';

describe('DataTable utils', () => {
    it('getCellStringValue - string', () => {
        const expectedValue = 'expectedValue';
        expect(getCellStringValue(expectedValue)).to.eql(expectedValue);
    });

    it('getCellStringValue - html string', () => {
        const expectedValue = 'expectedValue';
        expect(getCellStringValue(`<a href="someurl">${expectedValue}</a>`)).to.eql(expectedValue);
    });

    it('getCellStringValue - number', () => {
        const expectedValue = 1234;
        expect(getCellStringValue(expectedValue)).to.eql(`${expectedValue}`);
    });

    it('getCellStringValue - boolean', () => {
        const expectedValue = false;
        expect(getCellStringValue(expectedValue)).to.eql(expectedValue);
    });

    it('getCellStringValue - null', () => {
        expect(getCellStringValue(null)).to.eql(null);
    });

    it('getCellStringValue - element', () => {
        const expectedValue = 'expectedValue';
        expect(getCellStringValue(<a href="someurl">{expectedValue}</a>)).to.eql(expectedValue);
    });

    it('stringNumComparator - number', () => {
        expect(stringNumComparator(1, -1) > 0).to.eql(true);
        expect(stringNumComparator(-1, 1) < 0).to.eql(true);
        expect(stringNumComparator(1, 1)).to.eql(0);
        expect(stringNumComparator(null, 0) < 0).to.eql(true);
        expect(stringNumComparator(0, null) > 0).to.eql(true);
    });

    it('stringNumComparator - string', () => {
        expect(stringNumComparator('b', 'a') > 0).to.eql(true);
        expect(stringNumComparator('a', 'b') < 0).to.eql(true);
        expect(stringNumComparator('a', 'a')).to.eql(0);
        expect(stringNumComparator(null, 'a') < 0).to.eql(true);
        expect(stringNumComparator('a', null) > 0).to.eql(true);
    });
});
