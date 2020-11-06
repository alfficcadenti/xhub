import React from 'react';
import {expect} from 'chai';
import {getCellStringValue} from '../utils';

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
});
